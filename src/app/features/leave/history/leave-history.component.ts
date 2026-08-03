import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeaveService } from '../../../services/leave.service';
import { AuthService } from '../../../services/auth.service';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../../models';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatIconModule, MatButtonModule, MatChipsModule,
    MatTableModule, MatPaginatorModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatTooltipModule
  ],
  template: `
    <div class="leave-history">
      <div class="page-header">
        <div>
          <h2>Leave History</h2>
          <p>View and manage your leave requests</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/leave/apply">
          <mat-icon>add</mat-icon> Apply Leave
        </a>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
            <mat-option value="">All</mat-option>
            <mat-option *ngFor="let s of statuses" [value]="s">{{s}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Leave Type</mat-label>
          <mat-select [(ngModel)]="typeFilter" (selectionChange)="applyFilters()">
            <mat-option value="">All Types</mat-option>
            <mat-option *ngFor="let t of leaveTypes" [value]="t">{{t}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchQuery" (keyup)="applyFilters()" placeholder="Search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-pill approved">
          <span>{{getCount('Approved')}}</span> Approved
        </div>
        <div class="stat-pill pending">
          <span>{{getCount('Pending')}}</span> Pending
        </div>
        <div class="stat-pill rejected">
          <span>{{getCount('Rejected')}}</span> Rejected
        </div>
        <div class="stat-pill cancelled">
          <span>{{getCount('Cancelled')}}</span> Cancelled
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let leave of paginatedLeaves" [class]="leave.status.toLowerCase()">
              <td class="leave-id">{{leave.id}}</td>
              <td>{{leave.leaveType}}</td>
              <td>{{leave.startDate}}</td>
              <td>{{leave.endDate}}</td>
              <td>{{leave.days}}</td>
              <td class="reason-cell" [title]="leave.reason">{{leave.reason}}</td>
              <td>
                <span class="status-badge" [class]="leave.status.toLowerCase()">
                  {{leave.status}}
                </span>
              </td>
              <td>{{leave.appliedDate}}</td>
              <td>
                <button mat-icon-button *ngIf="leave.status === 'Pending'" (click)="cancelLeave(leave.id)"
                        matTooltip="Cancel">
                  <mat-icon>cancel</mat-icon>
                </button>
                <mat-icon *ngIf="leave.status !== 'Pending'" class="action-icon"
                  [class]="leave.status.toLowerCase()">
                  {{leave.status === 'Approved' ? 'check_circle' : leave.status === 'Rejected' ? 'cancel' : 'schedule'}}
                </mat-icon>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination-wrapper" *ngIf="filteredLeaves.length > pageSize">
          <button mat-icon-button (click)="previousPage()" [disabled]="currentPage === 0">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span>Page {{currentPage + 1}} of {{totalPages}}</span>
          <button mat-icon-button (click)="nextPage()" [disabled]="currentPage >= totalPages - 1">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

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
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filter-field {
      width: 200px;
    }

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
    }

    .stat-pill span {
      font-weight: 700;
      font-size: 16px;
    }

    .stat-pill.approved { background: #E8F5E9; color: #2E7D32; }
    .stat-pill.pending { background: #FFF8E1; color: #F57F17; }
    .stat-pill.rejected { background: #FFEBEE; color: #C62828; }
    .stat-pill.cancelled { background: #F3E5F5; color: #6A1B9A; }

    .table-container {
      background: white;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .leave-table {
      width: 100%;
      border-collapse: collapse;
    }

    .leave-table thead {
      background: #f5f7ff;
    }

    .leave-table th {
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #1a237e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #E8EAF6;
    }

    .leave-table td {
      padding: 12px 16px;
      font-size: 13px;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
    }

    .leave-table tr:hover {
      background: #fafbff;
    }

    .leave-id {
      font-weight: 600;
      color: #1a237e;
    }

    .reason-cell {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.approved { background: #E8F5E9; color: #2E7D32; }
    .status-badge.pending { background: #FFF8E1; color: #F57F17; }
    .status-badge.rejected { background: #FFEBEE; color: #C62828; }
    .status-badge.cancelled { background: #F3E5F5; color: #6A1B9A; }

    .action-icon {
      font-size: 18px;
    }

    .action-icon.approved { color: #4CAF50; }
    .action-icon.rejected { color: #F44336; }

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
      .leave-table { font-size: 12px; }
      .leave-table th, .leave-table td { padding: 8px 10px; }
    }

    @media (max-width: 768px) {
      .filters-bar { flex-direction: column; }
      .filter-field { width: 100%; }
    }
  `]
})
export class LeaveHistoryComponent implements OnInit {
  leaves: LeaveRequest[] = [];
  filteredLeaves: LeaveRequest[] = [];
  paginatedLeaves: LeaveRequest[] = [];
  statusFilter = '';
  typeFilter = '';
  searchQuery = '';
  currentPage = 0;
  pageSize = 10;

  statuses = Object.values(LeaveStatus);
  leaveTypes = Object.values(LeaveType);

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.leaveService.getLeavesByEmployee(user.id).subscribe(leaves => {
        this.leaves = leaves.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
        this.applyFilters();
      });
    }
  }

  applyFilters(): void {
    this.filteredLeaves = this.leaves.filter(l => {
      if (this.statusFilter && l.status !== this.statusFilter) return false;
      if (this.typeFilter && l.leaveType !== this.typeFilter) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        return l.employeeName.toLowerCase().includes(q) ||
               l.leaveType.toLowerCase().includes(q) ||
               l.reason.toLowerCase().includes(q) ||
               l.id.toLowerCase().includes(q);
      }
      return true;
    });
    this.currentPage = 0;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = this.currentPage * this.pageSize;
    this.paginatedLeaves = this.filteredLeaves.slice(start, start + this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLeaves.length / this.pageSize) || 1;
  }

  getCount(status: string): number {
    return this.leaves.filter(l => l.status === status).length;
  }

  cancelLeave(id: string): void {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.leaveService.cancelLeave(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
