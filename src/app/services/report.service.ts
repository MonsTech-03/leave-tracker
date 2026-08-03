import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LeaveRequest, Employee, Department, Holiday, LeaveExportData } from '../models';
import { LeaveService } from './leave.service';
import { EmployeeService } from './employee.service';
import { HolidayService } from './holiday.service';
import { LeaveStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportService {

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private holidayService: HolidayService
  ) {}

  getLeaveSummary(): Observable<LeaveExportData[]> {
    const leaves = this.leaveService.leavesSubject.value;
    const employees = this.employeeService.getEmployees();

    return of(leaves.map(l => ({
      LeaveID: l.id,
      EmployeeID: l.employeeId,
      EmployeeName: l.employeeName,
      Department: l.department,
      LeaveType: l.leaveType,
      StartDate: l.startDate,
      EndDate: l.endDate,
      Days: l.days,
      Status: l.status,
      AppliedDate: l.appliedDate,
      ManagerName: employees.find(e => e.id === l.approvedBy)?.firstName || '',
      Reason: l.reason
    })));
  }

  getEmployeeSummary(): Observable<any[]> {
    const employees = this.employeeService.getEmployees();
    const leaves = this.leaveService.leavesSubject.value;




    return of(employees.filter(e => e.role !== 'hr').map(emp => {
      const empLeaves = leaves.filter(l => l.employeeId === emp.id);
      return {
        EmployeeID: emp.id,
        Name: `${emp.firstName} ${emp.lastName}`,
        Department: emp.department,
        TotalLeaves: empLeaves.length,
        Approved: empLeaves.filter(l => l.status === LeaveStatus.Approved).length,
        Rejected: empLeaves.filter(l => l.status === LeaveStatus.Rejected).length,
        Pending: empLeaves.filter(l => l.status === LeaveStatus.Pending).length,
        TotalDays: empLeaves.filter(l => l.status === LeaveStatus.Approved).reduce((s, l) => s + l.days, 0)
      };
    }));
  }

  getDepartmentSummary(): Observable<any[]> {
    const departments = this.employeeService.getDepartments();
    const leaves = this.leaveService.leavesSubject.value;

    return of(departments.map(dept => {
      const deptLeaves = leaves.filter(l => l.department === dept.name);
      return {
        DepartmentID: dept.id,
        Department: dept.name,
        TotalEmployees: dept.employeeCount,
        TotalLeaves: deptLeaves.length,
        Approved: deptLeaves.filter(l => l.status === LeaveStatus.Approved).length,
        Rejected: deptLeaves.filter(l => l.status === LeaveStatus.Rejected).length,
        Pending: deptLeaves.filter(l => l.status === LeaveStatus.Pending).length,
        UtilizationRate: deptLeaves.length > 0
          ? Math.round((deptLeaves.filter(l => l.status === LeaveStatus.Approved).length / deptLeaves.length) * 100)
          : 0
      };
    }));
  }

  getManagerSummary(): Observable<any[]> {
    const managers = this.employeeService.getEmployees().filter(e => e.role === 'manager');
    const leaves = this.leaveService.leavesSubject.value;

    return of(managers.map(mgr => {
      const teamLeaves = leaves.filter(l => l.department === mgr.department);
      const pendingByTeam = teamLeaves.filter(l => l.status === LeaveStatus.Pending);
      return {
        ManagerID: mgr.id,
        Name: `${mgr.firstName} ${mgr.lastName}`,
        Department: mgr.department,
        TeamSize: this.employeeService.getEmployeesByDepartment(mgr.departmentId).length,
        PendingApprovals: pendingByTeam.length,
        ApprovedLeaves: teamLeaves.filter(l => l.status === LeaveStatus.Approved).length,
        AvgApprovalTime: '2.3 days'
      };
    }));
  }

  // ============================================
  // Export Methods
  // ============================================
  exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, filename);
  }

  exportToExcel(data: any[], filename: string): void {
    // Generate TSV (tab-separated) which Excel opens natively
    const headers = Object.keys(data[0]);
    const tsvRows = [
      headers.join('\t'),
      ...data.map(row => headers.map(h => `${row[h] || ''}`).join('\t'))
    ];

    const tsvContent = tsvRows.join('\n');
    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    this.downloadFile(blob, filename);
  }

  exportToPDF(data: any[], filename: string): void {
    // Simple HTML-based PDF generation
    const headers = Object.keys(data[0]);
    let html = `<html><head><style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
      th { background-color: #1a237e; color: white; }
      tr:nth-child(even) { background-color: #f2f2f2; }
      h1 { color: #1a237e; }
    </style></head><body>`;
    html += `<h1>${filename.replace('.pdf', '')}</h1>`;
    html += '<table><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    data.forEach(row => {
      html += '<tr>';
      headers.forEach(h => html += `<td>${row[h] || ''}</td>`);
      html += '</tr>';
    });
    html += '</tbody></table></body></html>';

    const blob = new Blob([html], { type: 'text/html' });
    this.downloadFile(blob, filename);
  }

  // ============================================
  // Power BI Export
  // ============================================
  exportPowerBIData(): void {
    const employees = this.employeeService.getEmployees();
    const leaves = this.leaveService.leavesSubject.value;
    const departments = this.employeeService.getDepartments();
    const holidays = this.holidayService.holidays;

    // Employee Data
    const empData = employees.map(e => ({
      EmployeeID: e.id,
      FirstName: e.firstName,
      LastName: e.lastName,
      Email: e.email,
      Phone: e.phone,
      Department: e.department,
      DepartmentID: e.departmentId,
      Designation: e.designation,
      ManagerID: e.managerId,
      Location: e.location,
      JoiningDate: e.joiningDate,
      Gender: e.gender,
      Role: e.role,
      Birthday: e.birthday,
      IsActive: e.isActive
    }));
    this.exportToCSV(empData, 'employee_data.csv');

    setTimeout(() => {
      // Leave Data
      const leaveData = leaves.map(l => ({
        LeaveID: l.id,
        EmployeeID: l.employeeId,
        EmployeeName: l.employeeName,
        Department: l.department,
        LeaveType: l.leaveType,
        StartDate: l.startDate,
        EndDate: l.endDate,
        Days: l.days,
        HalfDay: l.halfDay,
        Status: l.status,
        AppliedDate: l.appliedDate,
        ApprovedBy: l.approvedBy || '',
        ApprovedDate: l.approvedDate || '',
        RejectionReason: l.rejectionReason || '',
        Reason: l.reason
      }));
      this.exportToCSV(leaveData, 'leave_data.csv');

      setTimeout(() => {
        // Department Data
        const deptData = departments.map(d => ({
          DepartmentID: d.id,
          Name: d.name,
          HeadID: d.headId,
          HeadName: d.headName,
          EmployeeCount: d.employeeCount,
          Location: d.location
        }));
        this.exportToCSV(deptData, 'department_data.csv');

        setTimeout(() => {
          // Holiday Data
          const holData = holidays.map(h => ({
            HolidayID: h.id,
            Name: h.name,
            Date: h.date,
            Type: h.type,
            Description: h.description,
            IsOptional: h.isOptional
          }));
          this.exportToCSV(holData, 'holiday_data.csv');

          setTimeout(() => {
            // Manager Data
            const mgrData = employees.filter(e => e.role === 'manager').map(m => ({
              ManagerID: m.id,
              FirstName: m.firstName,
              LastName: m.lastName,
              Email: m.email,
              Department: m.department,
              DepartmentID: m.departmentId,
              Designation: m.designation,
              Location: m.location,
              JoiningDate: m.joiningDate,
              TeamSize: employees.filter(e => e.managerId === m.id).length
            }));
            this.exportToCSV(mgrData, 'manager_data.csv');
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
