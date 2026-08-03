import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginCredentials } from '../models';
import { EmployeeService } from './employee.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  private demoAccounts = [
    { email: 'hr@company.com', password: '123456', role: 'hr' as const },
    { email: 'admin@company.com', password: '123456', role: 'hr' as const }
  ];

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.loadSession();
  }

  private loadSession(): void {
    const saved = localStorage.getItem('leaveTrackerUser');
    if (saved) {
      const user = JSON.parse(saved) as User;
      this.currentUserSubject.next(user);
      this.isLoggedIn$.next(true);
    }
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: User; error?: string }> {

    // HR/Admin demo login
    const adminAccount = this.demoAccounts.find(
      a => a.email === credentials.email && a.password === credentials.password
    );

    if (adminAccount) {
      const user: User = {
        id: adminAccount.email.split('@')[0].toUpperCase(),
        email: adminAccount.email,
        name: 'HR Administrator',
        role: 'hr',
        department: 'Human Resources',
        departmentId: 'DEPT002',
        photoUrl: ''
      };

      localStorage.setItem('leaveTrackerUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isLoggedIn$.next(true);

      return of({ success: true, user });
    }

    // Employee / Manager login
    const employee = this.employeeService.getEmployeeByEmail(credentials.email);

    if (employee && credentials.password === '123456') {
      const user: User = {
        id: employee.id,
        email: employee.email,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.role,
        department: employee.department,
        departmentId: employee.departmentId,
        photoUrl: employee.photoUrl
      };

      localStorage.setItem('leaveTrackerUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isLoggedIn$.next(true);

      return of({ success: true, user });
    }

    return of({
      success: false,
      error: 'Invalid email or password.'
    });
  }

  logout(): void {
    localStorage.removeItem('leaveTrackerUser');
    this.currentUserSubject.next(null);
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  isManager(): boolean {
    return this.currentUserSubject.value?.role === 'manager' ||
           this.currentUserSubject.value?.role === 'hr';
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'hr';
  }
}
