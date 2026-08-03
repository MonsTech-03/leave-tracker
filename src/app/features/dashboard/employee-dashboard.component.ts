import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexChart,
  ApexLegend,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';

import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';

export type LeaveUsageChart = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    NgApexchartsModule
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  userName = '';

  employee: any;

  recentLeaves: any[] = [];

  leaveUsageChart!: LeaveUsageChart;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {

  this.employee = this.authService.getCurrentUser();

  this.userName = this.employee?.name || 'Employee';

  this.loadRecentLeaves();

  this.createChart();

}

  loadRecentLeaves(): void {

    const allLeaves = this.leaveService.leavesSubject.value;

    this.recentLeaves = allLeaves
      .filter(x => x.employeeId === this.employee.employeeId)
      .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate))
      .slice(0, 5);

  }

  createChart(): void {

    this.leaveUsageChart = {

      series: [
        12,
        4,
        3,
        2,
        1
      ],

      chart: {
        type: 'donut',
        height: 320
      },

      labels: [
        'Annual Leave',
        'Sick Leave',
        'Casual Leave',
        'Comp Off',
        'WFH'
      ],

      colors: [
        '#2563EB',
        '#22C55E',
        '#F59E0B',
        '#8B5CF6',
        '#06B6D4'
      ],

      legend: {
        position: 'bottom'
      }

    };

  }

}
