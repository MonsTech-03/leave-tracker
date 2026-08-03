import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee.service';
import { LeaveService } from '../../../services/leave.service';
import { LeaveType, LeaveStatus } from '../../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatIconModule, MatButtonModule, MatChipsModule,
    MatProgressBarModule, MatCardModule
  ],
  template: `
    <div class="profile-page">
      <div class="profile-header">
        <div class="profile-info">
          <div class="avatar-large">
            <span>{{initials}}</span>
          </div>
          <div>
            <h2>{{employee?.firstName}} {{employee?.lastName}}</h2>
            <p class="designation">{{employee?.designation}}</p>
            <p class="department">{{employee?.department}} | {{employee?.location}}</p>
          </div>
        </div>
        <div class="profile-actions">
          <a mat-stroked-button routerLink="/leave/apply">
            <mat-icon>add</mat-icon> Apply Leave
          </a>
        </div>
      </div>

      <div class="profile-content">
        <!-- Personal Details -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Personal Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Employee ID</span>
                <span class="value">{{employee?.id}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Email</span>
                <span class="value">{{employee?.email}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Phone</span>
                <span class="value">{{employee?.phone}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Department</span>
                <span class="value">{{employee?.department}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Manager</span>
                <span class="value">{{managerName}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Location</span>
                <span class="value">{{employee?.location}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Joining Date</span>
                <span class="value">{{employee?.joiningDate}}</span>
              </div>
              <div class="detail-item">
                <span class="label">Gender</span>
                <span class="value">{{employee?.gender}}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Leave Balances -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Leave Balance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="balance-grid">
              <div class="balance-card" *ngFor="let balance of leaveBalances">
                <div class="balance-header">
                  <mat-icon>{{getBalanceIcon(balance.leaveType)}}</mat-icon>
                  <span>{{balance.leaveType}}</span>
                </div>
                <div class="balance-numbers">
                  <span class="remaining">{{balance.remaining}}</span>
                  <span class="of">/ {{balance.allocated}}</span>
                </div>
                <mat-progress-bar [value]="getBalancePercent(balance)" mode="determinate"></mat-progress-bar>
                <div class="balance-details">
                  <span>Consumed: {{balance.consumed}}</span>
                  <span>{{getBalancePercent(balance)}}% used</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Activity -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Recent Leave Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let leave of recentLeaves">
                <div class="activity-icon" [class]="leave.status.toLowerCase()">
                  <mat-icon>{{getStatusIcon(leave.status)}}</mat-icon>
                </div>
                <div class="activity-details">
                  <span class="activity-title">{{leave.leaveType}}</span>
                  <span class="activity-date">{{leave.startDate}} - {{leave.endDate}} ({{leave.days}} days)</span>
                </div>
                <span class="activity-status" [class]="leave.status.toLowerCase()">{{leave.status}}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 24px;
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .avatar-large {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a237e, #42A5F5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .profile-info h2 {
      font-size: 22px;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }

    .designation {
      color: #666;
      margin: 4px 0 0;
      font-size: 14px;
    }

    .department {
      color: #999;
      margin: 2px 0 0;
      font-size: 13px;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-card {
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding: 8px 0;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item .label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item .value {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .balance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding: 8px 0;
    }

    .balance-card {
      padding: 16px;
      background: #f5f7ff;
      border-radius: 10px;
      border: 1px solid #E8EAF6;
    }

    .balance-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .balance-header mat-icon {
      color: #1a237e;
      font-size: 18px;
    }

    .balance-header span {
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }

    .balance-numbers {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 8px;
    }

    .balance-numbers .remaining {
      font-size: 28px;
      font-weight: 700;
      color: #1a237e;
    }

    .balance-numbers .of {
      font-size: 14px;
      color: #999;
    }

    .balance-details {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 11px;
      color: #888;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #fafafa;
      border-radius: 8px;
    }

    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .activity-icon.approved { background: #E8F5E9; }
    .activity-icon.approved mat-icon { color: #4CAF50; }
    .activity-icon.pending { background: #FFF8E1; }
    .activity-icon.pending mat-icon { color: #FFC107; }
    .activity-icon.rejected { background: #FFEBEE; }
    .activity-icon.rejected mat-icon { color: #F44336; }

    .activity-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .activity-title {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .activity-date {
      font-size: 12px;
      color: #888;
    }

    .activity-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .activity-status.approved { background: #E8F5E9; color: #2E7D32; }
    .activity-status.pending { background: #FFF8E1; color: #F57F17; }
    .activity-status.rejected { background: #FFEBEE; color: #C62828; }

    @media (max-width: 768px) {
      .profile-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  employee: any;
  managerName = '';
  leaveBalances: any[] = [];
  recentLeaves: any[] = [];
  initials = '';

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.employeeService.initialize();
    this.loadProfile();
  }

  loadProfile(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.employee = this.employeeService.getEmployeeById(user.id) || {
        id: user.id,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        phone: '+91 98765 43210',
        department: user.department,
        designation: user.role === 'manager' ? 'Department Manager' : 'Software Engineer',
        location: 'Bangalore',
        joiningDate: '2022-03-15',
        gender: 'Male',
        departmentId: user.departmentId,
        managerId: ''
      };
      this.initials = this.employee.firstName.charAt(0) + (this.employee.lastName?.charAt(0) || '');

      const manager = this.employeeService.getManagerByEmployee(user.id);
      this.managerName = manager ? `${manager.firstName} ${manager.lastName}` : 'N/A';

      this.leaveService.getEmployeeBalance(user.id).subscribe(balances => {
        this.leaveBalances = balances;
      });

      this.leaveService.getLeavesByEmployee(user.id).subscribe(leaves => {
        this.recentLeaves = leaves.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).slice(0, 5);
      });
    }
  }

  getBalancePercent(balance: any): number {
    if (balance.allocated === 0) return 0;
    return Math.round((balance.consumed / balance.allocated) * 100);
  }

  getBalanceIcon(leaveType: string): string {
    switch (leaveType) {
      case 'Annual Leave': return 'beach_access';
      case 'Sick Leave': return 'local_hospital';
      case 'Casual Leave': return 'event';
      case 'Work From Home': return 'home';
      case 'Comp Off': return 'swap_horiz';
      case 'Maternity Leave': return 'pregnant_woman';
      case 'Paternity Leave': return 'face';
      case 'Loss of Pay': return 'money_off';
      default: return 'event';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Approved': return 'check_circle';
      case 'Pending': return 'hourglass_empty';
      case 'Rejected': return 'cancel';
      default: return 'info';
    }
  }
}
