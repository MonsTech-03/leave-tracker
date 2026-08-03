import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { LeaveType } from '../../../models';

interface LeaveTypeInfo {
  type: LeaveType;
  allocated: number;
  icon: string;
  color: string;
  description: string;
  requiresApproval: boolean;
}

@Component({
  selector: 'app-admin-leave-types',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatChipsModule],
  template: `
    <div class="leave-types-page">
      <div class="page-header">
        <div>
          <h2>Leave Types Configuration</h2>
          <p>Manage leave types, allocations, and approval rules</p>
        </div>
      </div>

      <div class="types-grid">
        <mat-card *ngFor="let lt of leaveTypes" class="type-card">
          <div class="type-header">
            <div class="type-icon" [style.background]="lt.color">
              <mat-icon>{{lt.icon}}</mat-icon>
            </div>
            <div>
              <h4>{{lt.type}}</h4>
              <span class="allocation">{{lt.allocated}} days/year</span>
            </div>
          </div>
          <div class="type-details">
            <p>{{lt.description}}</p>
            <div class="type-rules">
              <div class="rule-item" *ngIf="lt.requiresApproval">
                <mat-icon>approval</mat-icon>
                <span>Manager approval required</span>
              </div>
              <div class="rule-item" *ngIf="lt.allocated <= 10">
                <mat-icon>verified_user</mat-icon>
                <span>HR approval required</span>
              </div>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Business Rules -->
      <div class="rules-section">
        <h3>Business Rules</h3>
        <div class="rules-grid">
          <div class="rule-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <h5>Weekend Exclusion</h5>
              <p>Leaves cannot be applied on weekends (Saturday & Sunday)</p>
            </div>
          </div>
          <div class="rule-card">
            <mat-icon>event_busy</mat-icon>
            <div>
              <h5>Holiday Exclusion</h5>
              <p>Leaves cannot be applied on public holidays</p>
            </div>
          </div>
          <div class="rule-card">
            <mat-icon>overlap</mat-icon>
            <div>
              <h5>No Overlapping</h5>
              <p>Employees cannot have overlapping leave requests</p>
            </div>
          </div>
          <div class="rule-card">
            <mat-icon>history</mat-icon>
            <div>
              <h5>No Past Dates</h5>
              <p>Leave applications cannot be backdated</p>
            </div>
          </div>
          <div class="rule-card">
            <mat-icon>balance</mat-icon>
            <div>
              <h5>Balance Check</h5>
              <p>System validates leave balance before submission</p>
            </div>
          </div>
          <div class="rule-card">
            <mat-icon>account_tree</mat-icon>
            <div>
              <h5>Approval Workflow</h5>
              <p>Employee → Manager → HR → Approved/Rejected</p>
            </div>
          </div>
        </div>
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

    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }

    .type-card {
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .type-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .type-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .type-icon mat-icon { color: white; font-size: 22px; }

    .type-header h4 {
      margin: 0;
      font-size: 15px;
      color: #333;
    }

    .allocation {
      font-size: 12px;
      color: #888;
    }

    .type-details p {
      font-size: 13px;
      color: #666;
      margin: 8px 0;
    }

    .type-rules {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
    }

    .rule-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #888;
    }

    .rule-item mat-icon { font-size: 16px; color: #90A4AE; }

    .rules-section {
      margin-top: 32px;
    }

    .rules-section h3 {
      font-size: 18px;
      color: #333;
      margin: 0 0 16px;
    }

    .rules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .rule-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      border: 1px solid #f0f0f0;
    }

    .rule-card mat-icon {
      font-size: 28px;
      color: #1a237e;
    }

    .rule-card h5 {
      margin: 0;
      font-size: 14px;
      color: #333;
    }

    .rule-card p {
      margin: 2px 0 0;
      font-size: 12px;
      color: #888;
    }

    @media (max-width: 768px) {
      .types-grid { grid-template-columns: 1fr; }
      .rules-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminLeaveTypesComponent {
  leaveTypes: LeaveTypeInfo[] = [
    { type: LeaveType.Annual, allocated: 24, icon: 'beach_access', color: '#1a237e', description: 'Annual vacation leave for personal time off', requiresApproval: true },
    { type: LeaveType.Sick, allocated: 12, icon: 'local_hospital', color: '#C62828', description: 'Medical leave for health-related absences', requiresApproval: true },
    { type: LeaveType.Casual, allocated: 10, icon: 'event', color: '#2E7D32', description: 'Casual leave for personal matters', requiresApproval: true },
    { type: LeaveType.WorkFromHome, allocated: 100, icon: 'home', color: '#00838F', description: 'Remote work days (unlimited)', requiresApproval: false },
    { type: LeaveType.CompOff, allocated: 5, icon: 'swap_horiz', color: '#6A1B9A', description: 'Compensatory leave for weekend/holiday work', requiresApproval: true },
    { type: LeaveType.Maternity, allocated: 180, icon: 'pregnant_woman', color: '#E91E63', description: 'Maternity leave for expecting mothers', requiresApproval: true },
    { type: LeaveType.Paternity, allocated: 15, icon: 'face', color: '#1565C0', description: 'Paternity leave for new fathers', requiresApproval: true },
    { type: LeaveType.LossOfPay, allocated: 5, icon: 'money_off', color: '#FF6F00', description: 'Leave without pay when balance is exhausted', requiresApproval: true },
  ];
}
