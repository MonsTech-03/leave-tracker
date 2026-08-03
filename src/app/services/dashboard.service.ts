import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStats, DepartmentLeaveData, MonthlyLeaveData } from '../models';
import { LeaveService } from './leave.service';
import { EmployeeService } from './employee.service';
import { HolidayService } from './holiday.service';
import { AuthService } from './auth.service';
import { LeaveStatus, LeaveType } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private holidayService: HolidayService,
    private authService: AuthService
  ) {}

  getStats(): Observable<DashboardStats> {
    const stats = this.leaveService.getLeaveStats();
    const leaves = this.leaveService.leavesSubject.value;
    const employees = this.employeeService.getEmployees().filter(e => e.role !== 'hr');
    const activeEmployees = employees.filter(e => e.isActive).length;

    // Calculate remaining leave for the current user (approximate)
    const totalApproved = stats.approved;
    const totalLeaves = stats.total;
    const year = new Date().getFullYear().toString();
    const user = this.authService.getCurrentUser();
    const userLeaves = leaves.filter(l => l.employeeId === user?.id && l.startDate.startsWith(year));
    const userConsumed = userLeaves.filter(l => l.status === LeaveStatus.Approved).reduce((sum, l) => sum + l.days, 0);
    const remainingLeave = Math.max(0, 24 - userConsumed);
    const attendance = totalLeaves > 0 ? Math.round(((activeEmployees * 22 - totalApproved) / (activeEmployees * 22)) * 100) : 87;

    this.holidayService.initialize();
    const upcomingHolidays = this.holidayService.holidays.filter(h => h.date >= new Date().toISOString().split('T')[0]);

    return of({
      remainingLeave: remainingLeave,
      leaveTaken: totalApproved,
      pendingRequests: stats.pending,
      approvedLeaves: totalApproved,
      rejectedLeaves: stats.rejected,
      upcomingHolidays: upcomingHolidays.length || 3,
      monthlyAttendance: Math.min(attendance, 95),
      teamOnLeave: leaves.filter(l =>
        l.status === LeaveStatus.Approved &&
        this.isTodayInRange(l.startDate, l.endDate)
      ).length
    });
  }

  getDepartmentLeaveData(): Observable<DepartmentLeaveData[]> {
    const departments = this.employeeService.getDepartments();
    const leaves = this.leaveService.leavesSubject.value;

    return of(departments.map(dept => {
      const deptLeaves = leaves.filter(l => l.department === dept.name);
      return {
        department: dept.name,
        totalLeaves: deptLeaves.length,
        approved: deptLeaves.filter(l => l.status === LeaveStatus.Approved).length,
        rejected: deptLeaves.filter(l => l.status === LeaveStatus.Rejected).length,
        pending: deptLeaves.filter(l => l.status === LeaveStatus.Pending).length
      };
    }));
  }

  getMonthlyLeaveData(): Observable<MonthlyLeaveData[]> {
    const leaves = this.leaveService.leavesSubject.value;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = new Date().getFullYear().toString();

    return of(months.map((month, idx) => {
      const monthStr = `${year}-${String(idx + 1).padStart(2, '0')}`;
      const monthLeaves = leaves.filter(l => l.startDate.startsWith(monthStr));
      return {
        month,
        total: monthLeaves.length,
        approved: monthLeaves.filter(l => l.status === LeaveStatus.Approved).length,
        rejected: monthLeaves.filter(l => l.status === LeaveStatus.Rejected).length,
        pending: monthLeaves.filter(l => l.status === LeaveStatus.Pending).length
      };
    }));
  }

  getLeaveTypeDistribution(): Observable<any[]> {
    const leaves = this.leaveService.leavesSubject.value;
    const types = Object.values(LeaveType);

    return of(types.map(type => ({
      name: type,
      value: leaves.filter(l => l.leaveType === type).length
    })));
  }

  getTeamAvailability(): Observable<any[]> {
    const employees = this.employeeService.getEmployees().filter(e => e.role !== 'hr');
    const leaves = this.leaveService.leavesSubject.value;
    const today = new Date().toISOString().split('T')[0];

    return of(employees.map(emp => {
      const onLeave = leaves.some(l =>
        l.employeeId === emp.id &&
        l.status === LeaveStatus.Approved &&
        this.isTodayInRange(l.startDate, l.endDate)
      );
      return {
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        status: onLeave ? 'On Leave' : 'Available',
        leaveType: onLeave ? leaves.find(l => l.employeeId === emp.id && l.status === LeaveStatus.Approved && this.isTodayInRange(l.startDate, l.endDate))?.leaveType : null
      };
    }));
  }

  private isTodayInRange(start: string, end: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return today >= start && today <= end;
  }
}
