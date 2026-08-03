import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Holiday } from '../models';
import { generateHolidays } from '../assets/mock-data/data-generator';

@Injectable({ providedIn: 'root' })
export class HolidayService {
  holidays: Holiday[] = [];
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.holidays = generateHolidays();
  }

  getAllHolidays(): Observable<Holiday[]> {
    this.initialize();
    return of(this.holidays);
  }

  getHolidaysByType(type: string): Observable<Holiday[]> {
    this.initialize();
    return of(this.holidays.filter(h => h.type === type));
  }

  getUpcomingHolidays(): Observable<Holiday[]> {
    this.initialize();
    const today = new Date().toISOString().split('T')[0];
    return of(this.holidays
      .filter(h => h.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
    );
  }

  isHoliday(date: string): boolean {
    this.initialize();
    return this.holidays.some(h => h.date === date);
  }

  isWeekend(date: string): boolean {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }

  getHolidaysByMonth(month: number): Holiday[] {
    this.initialize();
    return this.holidays.filter(h => {
      const d = new Date(h.date);
      return d.getMonth() + 1 === month;
    });
  }
}
