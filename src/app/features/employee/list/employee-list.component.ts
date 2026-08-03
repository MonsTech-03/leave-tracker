import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule
  ],
  template: `
    <div class="employee-list">
      <div class="page-header">
        <div>
          <h2>Employee Directory</h2>
          <p>{{employees.length}} employees across all departments</p>
        </div>
      </div>

      <div class="filters-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [(ngModel)]="searchQuery" (keyup)="applyFilters()" placeholder="Search employees...">
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Department</mat-label>
          <mat-select [(ngModel)]="deptFilter" (selectionChange)="applyFilters()">
            <mat-option value="">All Departments</mat-option>
            <mat-option *ngFor="let dept of departments" [value]="dept.id">{{dept.name}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Location</mat-label>
          <mat-select [(ngModel)]="locationFilter" (selectionChange)="applyFilters()">
            <mat-option value="">All Locations</mat-option>
            <mat-option value="Bangalore">Bangalore</mat-option>
            <mat-option value="Mumbai">Mumbai</mat-option>
            <mat-option value="Delhi">Delhi</mat-option>
            <mat-option value="Pune">Pune</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="employee-grid">
        <div class="employee-card" *ngFor="let emp of filteredEmployees">
          <div class="card-top">
            <div class="avatar" [style.background]="getAvatarColor(emp.id)">
              {{emp.firstName.charAt(0)}}{{emp.lastName.charAt(0)}}
            </div>
            <div class="emp-details">
              <h4>{{emp.firstName}} {{emp.lastName}}</h4>
              <p class="emp-role" [class]="emp.role">{{emp.role | titlecase}}</p>
            </div>
          </div>
          <div class="card-middle">
            <div class="emp-info-row">
              <mat-icon>business</mat-icon>
              <span>{{emp.department}}</span>
            </div>
            <div class="emp-info-row">
              <mat-icon>work</mat-icon>
              <span>{{emp.designation}}</span>
            </div>
            <div class="emp-info-row">
              <mat-icon>location_on</mat-icon>
              <span>{{emp.location}}</span>
            </div>
          </div>
          <div class="card-bottom">
            <span class="emp-id">{{emp.id}}</span>
            <span class="join-date">Joined {{emp.joiningDate}}</span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredEmployees.length === 0">
        <mat-icon>person_off</mat-icon>
        <p>No employees found matching your criteria</p>
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
    .filter-field { width: 200px; }

    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .employee-card {
      background: white;
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .card-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }

    .emp-details h4 {
      margin: 0;
      font-size: 15px;
      color: #333;
    }

    .emp-role {
      margin: 2px 0 0;
      font-size: 12px;
      color: #888;
    }

    .emp-role.manager { color: #1a237e; font-weight: 600; }
    .emp-role.hr { color: #E91E63; font-weight: 600; }

    .card-middle {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .emp-info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #555;
    }

    .emp-info-row mat-icon {
      font-size: 16px;
      color: #90A4AE;
    }

    .card-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
    }

    .emp-id {
      font-size: 12px;
      font-weight: 600;
      color: #1a237e;
    }

    .join-date {
      font-size: 12px;
      color: #999;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .filters-bar { flex-direction: column; }
      .filter-field { width: 100%; }
      .employee-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: any[] = [];
  searchQuery = '';
  deptFilter = '';
  locationFilter = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeService.initialize();
    this.employees = this.employeeService.getEmployees();
    this.departments = this.employeeService.getDepartments();
    this.filteredEmployees = [...this.employees];

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(emp => {
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matches = emp.firstName.toLowerCase().includes(q) ||
                       emp.lastName.toLowerCase().includes(q) ||
                       emp.email.toLowerCase().includes(q) ||
                       emp.department.toLowerCase().includes(q) ||
                       emp.designation.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (this.deptFilter && emp.departmentId !== this.deptFilter) return false;
      if (this.locationFilter && emp.location !== this.locationFilter) return false;
      return true;
    });
  }

  getAvatarColor(id: string): string {
    const colors = [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #a18cd1, #fbc2eb)',
      'linear-gradient(135deg, #fccb90, #d57eeb)',
      'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
    ];
    const index = parseInt(id.replace(/\D/g, '')) % colors.length;
    return colors[index];
  }
}
