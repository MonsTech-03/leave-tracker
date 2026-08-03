import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HolidayService } from '../../../services/holiday.service';
import { HolidayType } from '../../../models';

@Component({
  selector: 'app-admin-holidays',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatCheckboxModule,
    MatChipsModule, MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="admin-holidays">
      <div class="page-header">
        <div>
          <h2>Manage Holidays</h2>
          <p>Add, edit, and manage company holidays</p>
        </div>
      </div>

      <!-- Add Holiday Form -->
      <div class="add-holiday-card">
        <h3>Add New Holiday</h3>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Holiday Name</mat-label>
            <input matInput [(ngModel)]="newHoliday.name">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <input matInput type="date" [(ngModel)]="newHoliday.date">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select [(ngModel)]="newHoliday.type">
              <mat-option *ngFor="let t of holidayTypes" [value]="t">{{t}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-checkbox [(ngModel)]="newHoliday.isOptional">Optional</mat-checkbox>

          <button mat-flat-button (click)="addHoliday()" class="add-btn">
            <mat-icon>add</mat-icon> Add
          </button>
        </div>
      </div>

      <!-- Holiday List -->
      <div class="holiday-list">
        <div class="holiday-row" *ngFor="let holiday of holidays">
          <div class="holiday-info">
            <span class="holiday-name">{{holiday.name}}</span>
            <span class="holiday-date">{{holiday.date}}</span>
          </div>
          <span class="type-chip" [class]="getTypeClass(holiday.type)">{{holiday.type}}</span>
          <span class="optional-tag" *ngIf="holiday.isOptional">Optional</span>
          <button mat-icon-button color="warn" matTooltip="Delete" (click)="deleteHoliday(holiday.id)">
            <mat-icon>delete</mat-icon>
          </button>
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

    .add-holiday-card {
      background: white;
      border-radius: 14px;
      padding: 24px;
      margin: 20px 0;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .add-holiday-card h3 {
      margin: 0 0 16px;
      color: #333;
      font-size: 16px;
    }

    .form-row {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .form-row mat-form-field { flex: 1; min-width: 150px; }

    .add-btn {
      background: linear-gradient(135deg, #1a237e, #283593);
      height: 56px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .holiday-list {
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      overflow: hidden;
    }

    .holiday-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .holiday-row:last-child { border-bottom: none; }

    .holiday-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .holiday-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .holiday-date {
      font-size: 12px;
      color: #888;
    }

    .type-chip {
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }

    .type-chip.national { background: #E3F2FD; color: #1565C0; }
    .type-chip.festival { background: #FFF3E0; color: #E65100; }
    .type-chip.company { background: #E8F5E9; color: #2E7D32; }
    .type-chip.restricted { background: #F3E5F5; color: #6A1B9A; }

    .optional-tag {
      font-size: 11px;
      color: #999;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .form-row { flex-direction: column; }
      .form-row mat-form-field { width: 100%; }
    }
  `]
})
export class AdminHolidaysComponent implements OnInit {
  holidays: any[] = [];
  holidayTypes = Object.values(HolidayType);
  newHoliday = { name: '', date: '', type: HolidayType.National, description: '', isOptional: false };

  constructor(
    private holidayService: HolidayService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.holidayService.initialize();
    this.holidayService.getAllHolidays().subscribe(holidays => {
      this.holidays = holidays.sort((a, b) => a.date.localeCompare(b.date));
    });
  }

  addHoliday(): void {
    if (!this.newHoliday.name || !this.newHoliday.date) {
      this.snackBar.open('Please fill in name and date', 'OK', { duration: 3000 });
      return;
    }
    this.holidays.push({
      id: `HOL${String(this.holidays.length + 1).padStart(3, '0')}`,
      ...this.newHoliday,
      description: ''
    });
    this.newHoliday = { name: '', date: '', type: HolidayType.National, description: '', isOptional: false };
    this.snackBar.open('Holiday added successfully', 'OK', { duration: 3000 });
  }

  deleteHoliday(id: string): void {
    this.holidays = this.holidays.filter(h => h.id !== id);
    this.snackBar.open('Holiday deleted', 'OK', { duration: 3000 });
  }

  getTypeClass(type: string): string {
    return type.toLowerCase().split(' ')[0];
  }
}
