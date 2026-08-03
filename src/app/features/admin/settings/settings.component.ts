import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule, MatSlideToggleModule,
    MatCardModule, MatDividerModule, MatSelectModule,
    MatFormFieldModule, MatSnackBarModule
  ],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <div>
          <h2>Settings</h2>
          <p>Configure application preferences and policies</p>
        </div>
      </div>

      <div class="settings-grid">
        <!-- General Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon matCardAvatar>settings</mat-icon>
            <mat-card-title>General Settings</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Company Name</mat-label>
              <input matInput value="TechCorp Solutions Pvt Ltd">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fiscal Year Start</mat-label>
              <mat-select>
                <mat-option value="jan">January</mat-option>
                <mat-option value="apr">April</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-slide-toggle [checked]="true">Email Notifications</mat-slide-toggle>
            <br><br>
            <mat-slide-toggle [checked]="true">Leave Reminders</mat-slide-toggle>
            <br><br>
            <mat-slide-toggle [checked]="false">Auto Approve WFH</mat-slide-toggle>
          </mat-card-content>
        </mat-card>

        <!-- Leave Policy -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon matCardAvatar>policy</mat-icon>
            <mat-card-title>Leave Policy</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="policy-item">
              <span>Annual Leave</span>
              <span>24 days</span>
            </div>
            <mat-divider></mat-divider>
            <div class="policy-item">
              <span>Sick Leave</span>
              <span>12 days</span>
            </div>
            <mat-divider></mat-divider>
            <div class="policy-item">
              <span>Casual Leave</span>
              <span>10 days</span>
            </div>
            <mat-divider></mat-divider>
            <div class="policy-item">
              <span>Comp Off</span>
              <span>5 days</span>
            </div>
            <mat-divider></mat-divider>
            <div class="policy-item">
              <span>Work From Home</span>
              <span>Unlimited</span>
            </div>
            <mat-divider></mat-divider>
            <div class="policy-item">
              <span>Loss of Pay</span>
              <span>5 days</span>
            </div>

            <div class="policy-rules" style="margin-top: 16px;">
              <mat-slide-toggle [checked]="true">Exclude Weekends</mat-slide-toggle>
              <br><br>
              <mat-slide-toggle [checked]="true">Exclude Holidays</mat-slide-toggle>
              <br><br>
              <mat-slide-toggle [checked]="true">Require Manager Approval</mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Data Management -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon matCardAvatar>storage</mat-icon>
            <mat-card-title>Data Management</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <button mat-stroked-button class="action-btn" (click)="resetAllBalances()">
              <mat-icon>refresh</mat-icon> Reset All Leave Balances
            </button>
            <button mat-stroked-button class="action-btn" (click)="clearData()">
              <mat-icon>delete_forever</mat-icon> Clear All Data
            </button>
            <button mat-flat-button class="export-btn" (click)="exportData()">
              <mat-icon>sync</mat-icon> Update Power BI Data
            </button>
          </mat-card-content>
        </mat-card>
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

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .settings-card {
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .full-width { width: 100%; }

    .policy-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }

    .policy-item span:first-child { color: #555; }
    .policy-item span:last-child { font-weight: 600; color: #1a237e; }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin-bottom: 12px;
      justify-content: flex-start;
    }

    .export-btn {
      background: linear-gradient(135deg, #1a237e, #283593);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .settings-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SettingsComponent {
  constructor(private snackBar: MatSnackBar) {}

  resetAllBalances(): void {
    if (confirm('Are you sure you want to reset all leave balances?')) {
      this.snackBar.open('All leave balances have been reset', 'OK', { duration: 3000 });
    }
  }

  clearData(): void {
    if (confirm('This will clear all data. Are you sure?')) {
      this.snackBar.open('All data cleared', 'OK', { duration: 3000 });
    }
  }

  exportData(): void {
    this.snackBar.open('Exporting all data...', 'OK', { duration: 3000 });
  }
}
