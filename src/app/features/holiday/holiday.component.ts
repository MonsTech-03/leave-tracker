import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HolidayService } from '../../services/holiday.service';
import { Holiday, HolidayType } from '../../models';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatChipsModule, MatSelectModule, MatFormFieldModule
  ],
  template: `
    <div class="holiday-page">
      <div class="page-header">
        <div>
          <h2>Holiday Calendar</h2>
          <p>View upcoming holidays and company events</p>
        </div>
      </div>

      <!-- Type Filter -->
      <div class="filter-bar">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Holiday Type</mat-label>
          <mat-select [(ngModel)]="typeFilter" (selectionChange)="applyFilter()">
            <mat-option value="">All Types</mat-option>
            <mat-option *ngFor="let type of holidayTypes" [value]="type">{{type}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Holiday List -->
      <div class="holiday-timeline">
        <div class="holiday-item" *ngFor="let holiday of filteredHolidays" [class.optional]="holiday.isOptional">
          <div class="date-badge" [class]="getTypeClass(holiday.type)">
            <span class="month">{{getMonth(holiday.date)}}</span>
            <span class="day">{{getDay(holiday.date)}}</span>
          </div>
          <div class="holiday-details">
            <h4>{{holiday.name}}</h4>
            <p>{{holiday.description}}</p>
            <div class="holiday-meta">
              <span class="type-chip" [class]="getTypeClass(holiday.type)">{{holiday.type}}</span>
              <span *ngIf="holiday.isOptional" class="optional-badge">Optional</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredHolidays.length === 0">
        <mat-icon>event_busy</mat-icon>
        <p>No holidays found for this filter</p>
      </div>

      <!-- Summary -->
      <div class="summary-cards">
        <div class="summary-card" *ngFor="let type of typeSummary">
          <div class="summary-icon" [class]="getTypeClass(type.type)">
            <mat-icon>{{getTypeIcon(type.type)}}</mat-icon>
          </div>
          <div>
            <span class="count">{{type.count}}</span>
            <span class="label">{{type.type}}</span>
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

    .filter-bar {
      margin: 16px 0;
    }

    .filter-field {
      width: 220px;
    }

    .holiday-timeline {
      background: white;
      border-radius: 14px;
      padding: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .holiday-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s;
    }

    .holiday-item:hover {
      background: #fafbff;
    }

    .holiday-item:last-child {
      border-bottom: none;
    }

    .holiday-item.optional {
      opacity: 0.7;
    }

    .date-badge {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .date-badge .month {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .date-badge .day {
      font-size: 20px;
      font-weight: 700;
      line-height: 1;
    }

    .date-badge.national { background: #E3F2FD; color: #1565C0; }
    .date-badge.festival { background: #FFF3E0; color: #E65100; }
    .date-badge.company { background: #E8F5E9; color: #2E7D32; }
    .date-badge.restricted { background: #F3E5F5; color: #6A1B9A; }

    .holiday-details h4 {
      margin: 0;
      font-size: 15px;
      color: #333;
    }

    .holiday-details p {
      margin: 2px 0 6px;
      font-size: 12px;
      color: #888;
    }

    .holiday-meta {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .type-chip {
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }

    .type-chip.national { background: #E3F2FD; color: #1565C0; }
    .type-chip.festival { background: #FFF3E0; color: #E65100; }
    .type-chip.company { background: #E8F5E9; color: #2E7D32; }
    .type-chip.restricted { background: #F3E5F5; color: #6A1B9A; }

    .optional-badge {
      font-size: 11px;
      color: #999;
      font-style: italic;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 20px;
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .summary-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .summary-icon.national { background: #E3F2FD; }
    .summary-icon.national mat-icon { color: #1565C0; }
    .summary-icon.festival { background: #FFF3E0; }
    .summary-icon.festival mat-icon { color: #E65100; }
    .summary-icon.company { background: #E8F5E9; }
    .summary-icon.company mat-icon { color: #2E7D32; }
    .summary-icon.restricted { background: #F3E5F5; }
    .summary-icon.restricted mat-icon { color: #6A1B9A; }

    .summary-card .count {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }

    .summary-card .label {
      font-size: 11px;
      color: #888;
    }

    @media (max-width: 768px) {
      .summary-cards { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class HolidayComponent implements OnInit {
  holidays: Holiday[] = [];
  filteredHolidays: Holiday[] = [];
  typeFilter = '';
  holidayTypes = Object.values(HolidayType);
  typeSummary: any[] = [];

  constructor(private holidayService: HolidayService) {}

  ngOnInit(): void {
    this.holidayService.initialize();
    this.holidayService.getAllHolidays().subscribe(holidays => {
      this.holidays = holidays.sort((a, b) => a.date.localeCompare(b.date));
      this.filteredHolidays = [...this.holidays];
      this.calculateSummary();
    });
  }

  applyFilter(): void {
    if (this.typeFilter) {
      this.filteredHolidays = this.holidays.filter(h => h.type === this.typeFilter);
    } else {
      this.filteredHolidays = [...this.holidays];
    }
  }

  calculateSummary(): void {
    this.typeSummary = this.holidayTypes.map(type => ({
      type,
      count: this.holidays.filter(h => h.type === type).length
    }));
  }

  getMonth(date: string): string {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[new Date(date).getMonth()];
  }

  getDay(date: string): string {
    return String(new Date(date).getDate());
  }

  getTypeClass(type: string): string {
    return type.toLowerCase().split(' ')[0];
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case HolidayType.National: return 'flag';
      case HolidayType.Festival: return 'celebration';
      case HolidayType.Company: return 'business';
      case HolidayType.Restricted: return 'lock';
      default: return 'event';
    }
  }
}
