import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { LeaveService } from '../../../services/leave.service';
import { AuthService } from '../../../services/auth.service';
import { LeaveRequest, LeaveStatus } from '../../../models';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule,
    MatDialogModule, MatSnackBarModule, MatChipsModule
  ],
  template: `
    <div class="pending-approvals">
      <div class="page-header">
        <div>
          <h2>Pending Approvals</h2>
          <p>Review and approve leave requests from your team</p>
        </div>
        <div class="action-buttons">
          <button mat-flat-button class="approve-all-btn" (click)="approveAll()" *ngIf="pendingLeaves.length > 0">
            <mat-icon>done_all</mat-icon> Approve All
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-item pending-stat">
          <mat-icon>pending_actions</mat-icon>
          <div>
            <span class="stat-value">{{pendingLeaves.length}}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-item">
          <mat-icon>check_circle</mat-icon>
          <div>
            <span class="stat-value">{{approvedToday}}</span>
            <span class="stat-label">Approved Today</span>
          </div>
        </div>
      </div>

      <!-- Pending Cards -->
      <div class="cards-grid" *ngIf="pendingLeaves.length > 0">
        <div class="approval-card" *ngFor="let leave of pendingLeaves">
          <div class="card-header">
            <div class="employee-info">
              <div class="avatar">{{leave.employeeName.charAt(0)}}</div>
              <div>
                <h4>{{leave.employeeName}}</h4>
                <p>{{leave.department}}</p>
              </div>
            </div>
            <span class="leave-type-chip">{{leave.leaveType}}</span>
          </div>

          <div class="card-body">
            <div class="detail-row">
              <mat-icon>date_range</mat-icon>
              <span>{{leave.startDate}} - {{leave.endDate}}</span>
            </div>
            <div class="detail-row">
              <mat-icon>calendar_today</mat-icon>
              <span>{{leave.days}} day(s) {{leave.halfDay ? '(Half Day)' : ''}}</span>
            </div>
            <div class="detail-row">
              <mat-icon>description</mat-icon>
              <span>{{leave.reason}}</span>
            </div>
            <div class="detail-row">
              <mat-icon>schedule</mat-icon>
              <span>Applied: {{leave.appliedDate}}</span>
            </div>
          </div>

          <div class="card-actions">
            <button mat-stroked-button class="reject-btn" (click)="openRejectDialog(leave)">
              <mat-icon>close</mat-icon> Reject
            </button>
            <button mat-flat-button class="approve-btn" (click)="approveLeave(leave.id)">
              <mat-icon>check</mat-icon> Approve
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="pendingLeaves.length === 0">
        <mat-icon>check_circle</mat-icon>
        <h3>All Caught Up!</h3>
        <p>No pending leave requests to review</p>
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

    .stats-row {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .stat-item mat-icon {
      font-size: 32px;
      color: #FFC107;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #1a237e;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 20px;
    }

    .approval-card {
      background: white;
      border-radius: 14px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.2s;
    }

    .approval-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a237e, #42A5F5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 18px;
    }

    .employee-info h4 {
      margin: 0;
      font-size: 15px;
      color: #333;
    }

    .employee-info p {
      margin: 2px 0 0;
      font-size: 12px;
      color: #888;
    }

    .leave-type-chip {
      padding: 4px 12px;
      background: #E8EAF6;
      color: #1a237e;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #555;
    }

    .detail-row mat-icon {
      font-size: 18px;
      color: #90A4AE;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .reject-btn {
      color: #F44336;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .approve-btn {
      background: linear-gradient(135deg, #4CAF50, #2E7D32);
      display: flex;
      align-items: center;
      gap: 4px;
      color: white;
    }

    .approve-all-btn {
      background: linear-gradient(135deg, #1a237e, #283593);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .empty-state mat-icon {
      font-size: 64px;
      color: #4CAF50;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      color: #333;
      margin: 0 0 8px;
    }

    .empty-state p {
      color: #666;
      margin: 0;
    }

    @media (max-width: 768px) {
      .cards-grid { grid-template-columns: 1fr; }
      .stats-row { flex-direction: column; }
    }
  `]
})
export class PendingApprovalsComponent implements OnInit {
  pendingLeaves: LeaveRequest[] = [];
  approvedToday = 0;

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.leaveService.getPendingLeaves().subscribe(leaves => {
      this.pendingLeaves = leaves;
    });
  }

  approveLeave(id: string): void {
    const user = this.authService.getCurrentUser();
    this.leaveService.approveLeave(id, user?.id || '').subscribe(() => {
      this.snackBar.open('Leave approved successfully!', 'OK', { duration: 3000 });
      this.loadPending();
    });
  }

  openRejectDialog(leave: LeaveRequest): void {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.leaveService.rejectLeave(leave.id, reason).subscribe(() => {
        this.snackBar.open('Leave rejected', 'OK', { duration: 3000 });
        this.loadPending();
      });
    }
  }

  approveAll(): void {
    if (confirm('Approve all pending requests?')) {
      const user = this.authService.getCurrentUser();
      this.pendingLeaves.forEach(leave => {
        this.leaveService.approveLeave(leave.id, user?.id || '').subscribe();
      });
      this.snackBar.open('All pending requests approved!', 'OK', { duration: 3000 });
      setTimeout(() => this.loadPending(), 500);
    }
  }
}
