import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LeaveRequest, LeaveBalance, LeaveType, LeaveStatus } from '../models';
import { generateLeaveRequests, generateLeaveBalances } from '../assets/mock-data/data-generator';
import { EmployeeService } from './employee.service';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  leavesSubject = new BehaviorSubject<LeaveRequest[]>([]);
  private balancesSubject = new BehaviorSubject<LeaveBalance[]>([]);
  leaves$ = this.leavesSubject.asObservable();
  balances$ = this.balancesSubject.asObservable();

  private initialized = false;

  private readonly LEAVE_KEY = 'ltp_leaves';
  private readonly BALANCE_KEY = 'ltp_balances';

  constructor(private employeeService: EmployeeService) {}

  initialize(): void {

  if (this.initialized) return;

  this.initialized = true;

  const employees = this.employeeService.getEmployees();
  const holidays: any[] = [];

  const storedLeaves = localStorage.getItem(this.LEAVE_KEY);
  const storedBalances = localStorage.getItem(this.BALANCE_KEY);

  if (storedLeaves && storedBalances) {

    this.leavesSubject.next(JSON.parse(storedLeaves));
    this.balancesSubject.next(JSON.parse(storedBalances));

  } else {

    const leaves = generateLeaveRequests(employees, holidays);
    const balances = generateLeaveBalances(employees, leaves);

    this.leavesSubject.next(leaves);
    this.balancesSubject.next(balances);

    localStorage.setItem(this.LEAVE_KEY, JSON.stringify(leaves));
    localStorage.setItem(this.BALANCE_KEY, JSON.stringify(balances));

  }

}

  getAllLeaves(): Observable<LeaveRequest[]> {
    return of(this.leavesSubject.value);
  }

  getLeavesByEmployee(employeeId: string): Observable<LeaveRequest[]> {
    return of(this.leavesSubject.value.filter(l => l.employeeId === employeeId));
  }

  getLeavesByDepartment(deptId: string): Observable<LeaveRequest[]> {
    const employees = this.employeeService.getEmployees();
    const deptEmployees = employees.filter(e => e.departmentId === deptId);
    const empIds = new Set(deptEmployees.map(e => e.id));
    return of(this.leavesSubject.value.filter(l => empIds.has(l.employeeId)));
  }

  getPendingLeaves(): Observable<LeaveRequest[]> {
    return of(this.leavesSubject.value.filter(l => l.status === LeaveStatus.Pending));
  }

  getLeaveBalance(employeeId: string, leaveType: LeaveType): Observable<LeaveBalance | undefined> {
    const balances = this.balancesSubject.value;
    return of(balances.find(b => b.employeeId === employeeId && b.leaveType === leaveType));
  }

  getEmployeeBalance(employeeId: string): Observable<LeaveBalance[]> {
    return of(this.balancesSubject.value.filter(b => b.employeeId === employeeId));
  }

  applyLeave(leave: Partial<LeaveRequest>): Observable<LeaveRequest> {
    const newLeave: LeaveRequest = {
      id: `LV${String(this.leavesSubject.value.length + 1).padStart(4, '0')}`,
      employeeId: leave.employeeId || '',
      employeeName: leave.employeeName || '',
      leaveType: leave.leaveType || LeaveType.Casual,
      startDate: leave.startDate
  ? new Date(leave.startDate).toISOString().split('T')[0]
  : '',

endDate: leave.endDate
  ? new Date(leave.endDate).toISOString().split('T')[0]
  : '',
      days: leave.days || 1,
      halfDay: leave.halfDay || false,
      reason: leave.reason || '',
      status: LeaveStatus.Pending,
      appliedDate: new Date().toISOString().split('T')[0],
      department: leave.department || ''
    };
    const current = this.leavesSubject.value;
this.leavesSubject.next([newLeave, ...current]);
this.saveData();



return of(newLeave);
  }

  approveLeave(leaveId: string, approverId: string): Observable<LeaveRequest> {
    const leaves = this.leavesSubject.value;
    const idx = leaves.findIndex(l => l.id === leaveId);
    if (idx !== -1) {
      leaves[idx] = {
        ...leaves[idx],
        status: LeaveStatus.Approved,
        approvedBy: approverId,
        approvedDate: new Date().toISOString().split('T')[0]
      };
      this.leavesSubject.next([...leaves]);
      this.saveData();
      return of(leaves[idx]);
    }
    return of(leaves[0]);
  }

  rejectLeave(leaveId: string, reason: string): Observable<LeaveRequest> {
    const leaves = this.leavesSubject.value;
    const idx = leaves.findIndex(l => l.id === leaveId);
    if (idx !== -1) {
      leaves[idx] = {
        ...leaves[idx],
        status: LeaveStatus.Rejected,
        rejectionReason: reason
      };
      this.leavesSubject.next([...leaves]);
      this.saveData();
      return of(leaves[idx]);
    }
    return of(leaves[0]);
  }

  cancelLeave(leaveId: string): Observable<LeaveRequest> {
    const leaves = this.leavesSubject.value;
    const idx = leaves.findIndex(l => l.id === leaveId);
    if (idx !== -1) {
      leaves[idx] = { ...leaves[idx], status: LeaveStatus.Cancelled };
      this.leavesSubject.next([...leaves]);
      this.saveData();
      return of(leaves[idx]);
    }
    return of(leaves[0]);
  }

  calculateLeaveDays(startDate: string, endDate: string, holidays: any[], weekends: boolean = true): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = holidays.some((h: any) => h.date === current.toISOString().split('T')[0]);

      if (!isWeekend && !isHoliday) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }

    return days || 1;
  }

  getLeaveStats() {
    const leaves = this.leavesSubject.value;
    const total = leaves.length;
    const approved = leaves.filter(l => l.status === LeaveStatus.Approved).length;
    const rejected = leaves.filter(l => l.status === LeaveStatus.Rejected).length;
    const pending = leaves.filter(l => l.status === LeaveStatus.Pending).length;
    const cancelled = leaves.filter(l => l.status === LeaveStatus.Cancelled).length;
    return { total, approved, rejected, pending, cancelled };
  }

  private saveData(): void {

  localStorage.setItem(
    this.LEAVE_KEY,
    JSON.stringify(this.leavesSubject.value)
  );

  localStorage.setItem(
    this.BALANCE_KEY,
    JSON.stringify(this.balancesSubject.value)
  );

}
}
