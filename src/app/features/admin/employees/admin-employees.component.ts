import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models';

@Component({
  selector: 'app-admin-employees',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatChipsModule, MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="admin-employees">
      <div class="page-header">
        <div>
          <h2>Manage Employees</h2>
          <p>View and manage all employees in the organization</p>
        </div>
      </div>

      <div class="filters-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [(ngModel)]="searchQuery" (keyup)="applyFilters()" placeholder="Search...">
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Role</mat-label>
          <mat-select [(ngModel)]="roleFilter" (selectionChange)="applyFilters()">
            <mat-option value="">All Roles</mat-option>
            <mat-option value="employee">Employee</mat-option>
            <mat-option value="manager">Manager</mat-option>
            <mat-option value="hr">HR</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Department</mat-label>
          <mat-select [(ngModel)]="deptFilter" (selectionChange)="applyFilters()">
            <mat-option value="">All Departments</mat-option>
            <mat-option *ngFor="let dept of departments" [value]="dept.id">{{dept.name}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="stats-bar">
        <div class="stat-pill">
          <span>{{filteredEmployees.length}}</span> Total
        </div>
        <div class="stat-pill employee-pill">
          <span>{{filteredEmployees.filter(e => e.role === 'employee').length}}</span> Employees
        </div>
        <div class="stat-pill manager-pill">
          <span>{{filteredEmployees.filter(e => e.role === 'manager').length}}</span> Managers
        </div>
        <div class="stat-pill hr-pill">
          <span>{{filteredEmployees.filter(e => e.role === 'hr').length}}</span> HR Staff
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of paginatedEmployees">
              <td class="emp-id">{{emp.id}}</td>
              <td>
                <div class="name-cell">
                  <div class="avatar-sm" [style.background]="getAvatarColor(emp.id)">
                    {{emp.firstName.charAt(0)}}{{emp.lastName.charAt(0)}}
                  </div>
                  <span>{{emp.firstName}} {{emp.lastName}}</span>
                </div>
              </td>
              <td>{{emp.email}}</td>
              <td>{{emp.department}}</td>
              <td>{{emp.designation}}</td>
              <td><span class="role-badge" [class]="emp.role">{{emp.role | titlecase}}</span></td>
              <td>{{emp.location}}</td>
              <td>
                <button mat-icon-button matTooltip="View Profile">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Reset Leave Balance" (click)="resetBalance(emp)">
                  <mat-icon>refresh</mat-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-wrapper" *ngIf="filteredEmployees.length > pageSize">
        <button mat-icon-button (click)="prevPage()" [disabled]="currentPage === 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span>Page {{currentPage + 1}} of {{totalPages}}</span>
        <button mat-icon-button (click)="nextPage()" [disabled]="currentPage >= totalPages - 1">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }

    .page-header p {
      color: #666;
      font-size: 14px;
      margin: 4px 0 0;
    }

    .filters-bar {
      display: flex;
      gap: 16px;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    .search-field { flex: 1; min-width: 250px; }
    .filter-field { width: 180px; }

    .stats-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .stat-pill {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      background: #f0f0f0;
      color: #666;
    }

    .stat-pill span { font-weight: 700; font-size: 16px; }
    .stat-pill.employee-pill { background: #E3F2FD; color: #1565C0; }
    .stat-pill.manager-pill { background: #E8F5E9; color: #2E7D32; }
    .stat-pill.hr-pill { background: #FCE4EC; color: #C2185B; }

    .table-container {
      background: white;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #1a237e;
      background: #f5f7ff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #E8EAF6;
    }

    .data-table td {
      padding: 12px 16px;
      font-size: 13px;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
    }

    .data-table tr:hover { background: #fafbff; }

    .emp-id { font-weight: 600; color: #1a237e; }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .role-badge {
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }

    .role-badge.employee { background: #E3F2FD; color: #1565C0; }
    .role-badge.manager { background: #E8F5E9; color: #2E7D32; }
    .role-badge.hr { background: #FCE4EC; color: #C2185B; }

    .pagination-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px;
      font-size: 13px;
      color: #666;
    }

    @media (max-width: 1024px) {
      .data-table { font-size: 12px; }
      .data-table th, .data-table td { padding: 8px 10px; }
    }
  `]
})
export class AdminEmployeesComponent implements OnInit {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  departments: any[] = [];
  searchQuery = '';
  roleFilter = '';
  deptFilter = '';
  currentPage = 0;
  pageSize = 15;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeService.initialize();
    this.allEmployees = this.employeeService.getEmployees();
    this.departments = this.employeeService.getDepartments();
    this.filteredEmployees = [...this.allEmployees];
    this.updatePagination();
  }

  applyFilters(): void {
    this.filteredEmployees = this.allEmployees.filter(emp => {
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const match = emp.firstName.toLowerCase().includes(q) ||
                     emp.lastName.toLowerCase().includes(q) ||
                     emp.email.toLowerCase().includes(q) ||
                     emp.department.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (this.roleFilter && emp.role !== this.roleFilter) return false;
      if (this.deptFilter && emp.departmentId !== this.deptFilter) return false;
      return true;
    });
    this.currentPage = 0;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = this.currentPage * this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
  }

  prevPage(): void {
    if (this.currentPage > 0) { this.currentPage--; this.updatePagination(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) { this.currentPage++; this.updatePagination(); }
  }

  resetBalance(emp: Employee): void {
    if (confirm(`Reset leave balance for ${emp.firstName} ${emp.lastName}?`)) {
      this.snackBar.open('Leave balance reset successfully', 'OK', { duration: 3000 });
    }
  }

  getAvatarColor(id: string): string {
    const colors = [
      '#1a237e', '#283593', '#1565C0', '#00838F',
      '#2E7D32', '#E65100', '#6A1B9A', '#C62828'
    ];
    return colors[parseInt(id.replace(/\D/g, '')) % colors.length];
  }
}
