import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis
} from 'ng-apexcharts';

import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { LeaveService } from '../../services/leave.service';

export type TeamChart = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
};

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    NgApexchartsModule
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  userName = '';
  department = '';

  pendingApprovals = 0;
  teamMembers = 0;
  onLeaveToday = 0;
  attendance = 96;

  workingToday = 0;
  remoteEmployees = 3;
  upcomingLeaves = 5;

  pendingRequests: any[] = [];

  teamChart!: TeamChart;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {

    const manager = this.authService.getCurrentUser();

    this.userName = manager?.name || 'Manager';
    this.department = manager?.department || '';

    this.loadDashboard();
    this.createChart();

  }

  loadDashboard(): void {

    const manager = this.authService.getCurrentUser();

    if (!manager) {
      return;
    }

    const employees = this.employeeService.getEmployeesByManager(manager.id);

    this.teamMembers = employees.length;

    this.workingToday = Math.max(0, employees.length - 3);

    const teamIds = employees.map(e => e.id);

    this.leaveService.getAllLeaves().subscribe((allLeaves) => {

      this.pendingRequests = allLeaves
        .filter((l: any) =>
          teamIds.includes(l.employeeId) &&
          l.status === 'Pending'
        )
        .slice(0, 5);

      this.pendingApprovals = this.pendingRequests.length;

      this.onLeaveToday = allLeaves
        .filter((l: any) =>
          teamIds.includes(l.employeeId) &&
          l.status === 'Approved'
        )
        .length;

    });

  }

  createChart(): void {

    this.teamChart = {

      series: [
        {
          name: 'Employees',
          data: [18, 4, 6]
        }
      ],

      chart: {
        type: 'bar',
        height: 320,
        toolbar: {
          show: false
        }
      },

      xaxis: {
        categories: [
          'Working',
          'On Leave',
          'WFH'
        ]
      },

      colors: [
        '#10B981'
      ],

      dataLabels: {
        enabled: false
      },

      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '45%'
        }
      }

    };

  }

}
