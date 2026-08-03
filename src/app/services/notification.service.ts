import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Notification, NotificationType } from '../models';
import { generateNotifications } from '../assets/mock-data/data-generator';
import { EmployeeService } from './employee.service';
import { LeaveService } from './leave.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: Notification[] = [];
  private unreadSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadSubject.asObservable();
  private initialized = false;

  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService
  ) {}

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
    const employees = this.employeeService.getEmployees();
    const leaves = this.leaveService.leavesSubject.value;
    const generated = generateNotifications(employees, leaves);
    this.notifications = generated.map(g => ({
      id: g.id,
      type: g.type as NotificationType,
      message: g.msg,
      date: g.date,
      isRead: g.isRead
    }));
    this.updateUnreadCount();
  }

  getNotifications(): Observable<Notification[]> {
    return of(this.notifications);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.updateUnreadCount();
  }

  addNotification(type: NotificationType, message: string): void {
    const newNotif: Notification = {
      id: `NOT${String(this.notifications.length + 1).padStart(4, '0')}`,
      type,
      message,
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };
    this.notifications.unshift(newNotif);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    this.unreadSubject.next(this.notifications.filter(n => !n.isRead).length);
  }
}
