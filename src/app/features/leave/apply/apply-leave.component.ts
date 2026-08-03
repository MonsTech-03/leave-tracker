import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LeaveService } from '../../../services/leave.service';
import { HolidayService } from '../../../services/holiday.service';
import { AuthService } from '../../../services/auth.service';
import { LeaveType, LeaveStatus } from '../../../models';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatCheckboxModule, MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule, MatProgressBarModule
  ],
  template: `
    <div class="apply-leave">
      <div class="page-header">
        <h2>Apply for Leave</h2>
        <p>Submit your leave request for manager approval</p>
      </div>

      <div class="form-container">
        <mat-card class="leave-form-card">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Leave Type</mat-label>
              <mat-select [(ngModel)]="leaveType">
                <mat-option *ngFor="let type of leaveTypes" [value]="type">{{type}}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate">
              <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate">
              <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <div class="checkbox-field">
              <mat-checkbox [(ngModel)]="halfDay">Half Day</mat-checkbox>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason for Leave</mat-label>
              <textarea matInput [(ngModel)]="reason" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Emergency Contact Name</mat-label>
              <input matInput [(ngModel)]="emergencyContact">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Emergency Contact Phone</mat-label>
              <input matInput [(ngModel)]="emergencyPhone">
            </mat-form-field>
          </div>

          <!-- Leave Balance Info -->
          <div class="balance-info" *ngIf="leaveType">
            <h4>Leave Balance</h4>
            <div class="balance-cards">
              <div class="balance-item">
                <span class="label">Allocated</span>
                <span class="value">{{currentBalance?.allocated || 0}}</span>
              </div>
              <div class="balance-item">
                <span class="label">Consumed</span>
                <span class="value">{{currentBalance?.consumed || 0}}</span>
              </div>
              <div class="balance-item">
                <span class="label">Remaining</span>
                <span class="value remaining">{{currentBalance?.remaining || 0}}</span>
              </div>
              <div class="balance-item">
                <span class="label">Calculated Days</span>
                <span class="value">{{calculatedDays}}</span>
              </div>
            </div>
            <mat-progress-bar [value]="getUsagePercentage()" mode="determinate"></mat-progress-bar>
            <p class="usage-text">{{getUsagePercentage()}}% utilized</p>
          </div>

          <!-- Validation Messages -->
          <div class="validation-messages">
            <p class="error" *ngIf="validationErrors.startPast">Start date cannot be in the past</p>
            <p class="error" *ngIf="validationErrors.overlap">Leave overlaps with existing approved leave</p>
            <p class="error" *ngIf="validationErrors.weekend">Leave falls on weekends</p>
            <p class="error" *ngIf="validationErrors.holiday">Leave falls on a holiday</p>
            <p class="error" *ngIf="validationErrors.balance">Insufficient leave balance</p>
          </div>

          <div class="form-actions">
            <button mat-stroked-button (click)="resetForm()">
              <mat-icon>refresh</mat-icon> Reset
            </button>
            <button mat-flat-button (click)="submitLeave()" class="submit-btn">
              <mat-icon>send</mat-icon> Submit Leave Request
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .apply-leave {
      padding-bottom: 24px;
    }

    .page-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1a237e;
      margin: 0 0 4px;
    }

    .page-header p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    .form-container {
      margin-top: 20px;
    }

    .leave-form-card {
      border-radius: 14px;
      padding: 32px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .checkbox-field {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }

    .balance-info {
      margin-top: 24px;
      padding: 20px;
      background: #f5f7ff;
      border-radius: 12px;
      border: 1px solid #E8EAF6;
    }

    .balance-info h4 {
      margin: 0 0 16px;
      color: #1a237e;
      font-size: 14px;
    }

    .balance-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 12px;
    }

    .balance-item {
      text-align: center;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .balance-item .label {
      display: block;
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
    }

    .balance-item .value {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }

    .balance-item .value.remaining {
      color: #4CAF50;
    }

    .usage-text {
      font-size: 12px;
      color: #666;
      margin: 8px 0 0;
      text-align: center;
    }

    .validation-messages {
      margin-top: 16px;
    }

    .error {
      color: #F44336;
      font-size: 13px;
      margin: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .submit-btn {
      background: linear-gradient(135deg, #1a237e, #283593);
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .balance-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ApplyLeaveComponent implements OnInit {
  leaveType: LeaveType = LeaveType.Casual;
  startDate: string = '';
  endDate: string = '';
  halfDay = false;
  reason = '';
  emergencyContact = '';
  emergencyPhone = '';
  calculatedDays = 1;
  currentBalance: any = null;

  validationErrors = {
    startPast: false,
    overlap: false,
    weekend: false,
    holiday: false,
    balance: false
  };

  leaveTypes = Object.values(LeaveType);

  constructor(
    private leaveService: LeaveService,
    private holidayService: HolidayService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.updateBalance();
  }

  updateBalance(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.leaveService.getLeaveBalance(user.id, this.leaveType).subscribe(balance => {
        this.currentBalance = balance;
      });
    }
  }

  getUsagePercentage(): number {
    if (!this.currentBalance || this.currentBalance.allocated === 0) return 0;
    return Math.round((this.currentBalance.consumed / this.currentBalance.allocated) * 100);
  }

  submitLeave(): void {
    // Validation
    this.validationErrors = { startPast: false, overlap: false, weekend: false, holiday: false, balance: false };
    let hasError = false;

    if (!this.startDate || !this.endDate) {
      this.snackBar.open('Please select start and end dates', 'OK', { duration: 3000 });
      return;
    }

    if (!this.reason.trim()) {
      this.snackBar.open('Please provide a reason', 'OK', { duration: 3000 });
      return;
    }

    // Check past dates
    if (new Date(this.startDate) < new Date(new Date().toDateString())) {
      this.validationErrors.startPast = true;
      hasError = true;
    }

    // Check weekend
    const startDay = new Date(this.startDate).getDay();
    if (startDay === 0 || startDay === 6) {
      this.validationErrors.weekend = true;
      hasError = true;
    }

    // Check holiday
    if (this.holidayService.isHoliday(this.startDate)) {
      this.validationErrors.holiday = true;
      hasError = true;
    }

    // Check balance
    if (this.currentBalance && this.calculatedDays > this.currentBalance.remaining) {
      this.validationErrors.balance = true;
      hasError = true;
    }

    if (hasError) return;

    const user = this.authService.getCurrentUser();
    const leave = {
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      leaveType: this.leaveType,
      startDate: this.startDate,
      endDate: this.endDate,
      days: this.halfDay ? 0.5 : this.calculatedDays,
      halfDay: this.halfDay,
      reason: this.reason,
      department: user?.department || ''
    };

    this.leaveService.applyLeave(leave).subscribe(result => {
      this.snackBar.open('Leave request submitted successfully!', 'OK', { duration: 3000 });
      this.router.navigate(['/leave/history']);
    });
  }

  resetForm(): void {
    this.leaveType = LeaveType.Casual;
    this.startDate = '';
    this.endDate = '';
    this.halfDay = false;
    this.reason = '';
    this.emergencyContact = '';
    this.emergencyPhone = '';
    this.calculatedDays = 1;
    this.validationErrors = { startPast: false, overlap: false, weekend: false, holiday: false, balance: false };
    this.updateBalance();
  }
}
