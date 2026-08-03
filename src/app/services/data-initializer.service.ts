import { Injectable, APP_INITIALIZER } from '@angular/core';
import { LeaveService } from './leave.service';
import { EmployeeService } from './employee.service';
import { HolidayService } from './holiday.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class DataInitializerService {
  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private holidayService: HolidayService,
    private notificationService: NotificationService
  ) {}

  initialize(): () => Promise<void> {
    return () => {
      return new Promise<void>((resolve) => {
        // Initialize all services in order of dependency
        this.employeeService.initialize();
        this.leaveService.initialize();
        this.holidayService.initialize();
        this.notificationService.initialize();
        resolve();
      });
    };
  }
}

export const dataInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: (initializer: DataInitializerService) => initializer.initialize(),
  deps: [DataInitializerService],
  multi: true
};
