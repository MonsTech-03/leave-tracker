import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { LeaveService } from '../../../services/leave.service';
import { HolidayService } from '../../../services/holiday.service';
import { AuthService } from '../../../services/auth.service';
import { LeaveStatus } from '../../../models';

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  hasApproved: boolean;
  hasPending: boolean;
  dayOfWeek: number;
}

@Component({
  selector: 'app-leave-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="calendar-page">
      <div class="page-header">
        <div>
          <h2>Leave Calendar</h2>
          <p>View approved leaves, pending requests, and holidays</p>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item"><span class="dot approved"></span> Approved Leave</div>
        <div class="legend-item"><span class="dot pending"></span> Pending Request</div>
        <div class="legend-item"><span class="dot holiday"></span> Holiday</div>
        <div class="legend-item"><span class="dot weekend"></span> Weekend</div>
        <div class="legend-item"><span class="dot today"></span> Today</div>
      </div>

      <!-- Calendar Navigation -->
      <div class="calendar-nav">
        <button mat-icon-button (click)="previousMonth()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <h3>{{monthNames[currentMonth]}} {{currentYear}}</h3>
        <button mat-icon-button (click)="nextMonth()">
          <mat-icon>chevron_right</mat-icon>
        </button>
        <button mat-stroked-button (click)="goToToday()">Today</button>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <div class="day-header" *ngFor="let day of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']">
          {{day}}
        </div>

        <div class="calendar-cell" *ngFor="let cell of calendarDays"
             [class.empty]="cell === null"
             [class.today]="cell?.isToday"
             [class.weekend]="cell?.isWeekend"
             [class.holiday]="cell?.isHoliday"
             [class.has-approved]="cell?.hasApproved"
             [class.has-pending]="cell?.hasPending"
             (click)="cell && showDayInfo(cell)">
          <span class="day-number">{{cell?.date}}</span>
          <div class="day-indicators">
            <span class="indicator approved" *ngIf="cell?.hasApproved"></span>
            <span class="indicator pending" *ngIf="cell?.hasPending"></span>
          </div>
        </div>
      </div>

      <!-- Month Summary -->
      <div class="month-summary">
        <h4>Monthly Summary</h4>
        <div class="summary-cards">
          <div class="summary-card">
            <span class="summary-value">{{monthStats.approved}}</span>
            <span class="summary-label">Approved Days</span>
          </div>
          <div class="summary-card">
            <span class="summary-value">{{monthStats.pending}}</span>
            <span class="summary-label">Pending Days</span>
          </div>
          <div class="summary-card">
            <span class="summary-value">{{monthStats.holidays}}</span>
            <span class="summary-label">Holidays</span>
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

    .legend {
      display: flex;
      gap: 20px;
      margin: 16px 0;
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #555;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .dot.approved { background: #4CAF50; }
    .dot.pending { background: #FFC107; }
    .dot.holiday { background: #E91E63; }
    .dot.weekend { background: #9E9E9E; }
    .dot.today { background: #1a237e; }

    .calendar-nav {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 16px 0;
    }

    .calendar-nav h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1a237e;
      margin: 0;
      flex: 1;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      background: white;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .day-header {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      padding: 8px;
      text-transform: uppercase;
    }

    .calendar-cell {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      min-height: 60px;
    }

    .calendar-cell.empty {
      cursor: default;
    }

    .calendar-cell:hover:not(.empty) {
      background: #f0f0f0;
    }

    .calendar-cell.today {
      background: #1a237e;
      color: white;
    }

    .calendar-cell.weekend {
      background: #f5f5f5;
      color: #999;
    }

    .calendar-cell.holiday {
      background: #FCE4EC;
    }

    .calendar-cell.has-approved {
      background: #E8F5E9;
    }

    .calendar-cell.has-pending {
      background: #FFF8E1;
    }

    .day-number {
      font-size: 14px;
      font-weight: 500;
    }

    .day-indicators {
      display: flex;
      gap: 2px;
      margin-top: 2px;
    }

    .indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .indicator.approved { background: #4CAF50; }
    .indicator.pending { background: #FFC107; }

    .month-summary {
      margin-top: 24px;
      background: white;
      border-radius: 14px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .month-summary h4 {
      margin: 0 0 16px;
      color: #333;
      font-size: 16px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .summary-card {
      text-align: center;
      padding: 16px;
      background: #f5f7ff;
      border-radius: 10px;
    }

    .summary-value {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #1a237e;
    }

    .summary-label {
      font-size: 12px;
      color: #666;
    }

    @media (max-width: 768px) {
      .calendar-grid { gap: 1px; padding: 8px; }
      .calendar-cell { min-height: 40px; }
      .day-number { font-size: 12px; }
      .summary-cards { grid-template-columns: 1fr; }
    }
  `]
})
export class LeaveCalendarComponent implements OnInit {
  currentMonth: number;
  currentYear: number;
  calendarDays: (CalendarDay | null)[] = [];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  monthStats = { approved: 0, pending: 0, holidays: 0 };

  constructor(
    private leaveService: LeaveService,
    private holidayService: HolidayService,
    private authService: AuthService
  ) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
  }

  ngOnInit(): void {
    this.buildCalendar();
  }

  buildCalendar(): void {
    this.calendarDays = [];
    this.monthStats = { approved: 0, pending: 0, holidays: 0 };

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push(null);
    }

    const user = this.authService.getCurrentUser();
    const allLeaves = this.leaveService.leavesSubject.value;
    const empLeaves = allLeaves.filter(l => l.employeeId === user?.id);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = this.holidayService.isHoliday(dateStr);
      const isToday = new Date().toDateString() === date.toDateString();

      const hasApproved = empLeaves.some(l =>
        l.status === LeaveStatus.Approved &&
        dateStr >= l.startDate && dateStr <= l.endDate
      );
      const hasPending = empLeaves.some(l =>
        l.status === LeaveStatus.Pending &&
        dateStr >= l.startDate && dateStr <= l.endDate
      );

      if (hasApproved) this.monthStats.approved++;
      if (hasPending) this.monthStats.pending++;
      if (isHoliday && !isWeekend) this.monthStats.holidays++;

      this.calendarDays.push({
        date: day,
        month: this.currentMonth,
        year: this.currentYear,
        isToday,
        isWeekend,
        isHoliday,
        hasApproved,
        hasPending,
        dayOfWeek
      });
    }
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.buildCalendar();
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.buildCalendar();
  }

  showDayInfo(cell: CalendarDay): void {
    const dateStr = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.date).padStart(2, '0')}`;
    // Could open a dialog here
  }
}
