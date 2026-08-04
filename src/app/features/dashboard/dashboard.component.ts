import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExportService } from '../../services/export.service';


import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexPlotOptions,
  ApexLegend,
  ApexResponsive,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';

import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { LeaveService } from '../../services/leave.service';
import {
  DashboardStats,
  DepartmentLeaveData,
  MonthlyLeaveData
} from '../../models';

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  colors: string[];
  legend: ApexLegend;
  responsive: ApexResponsive[];
};

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    NgApexchartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit {

  userName = '';
  greeting = '';
currentDate = '';
currentTime = '';

  statCards: any[] = [];

  monthlyData: MonthlyLeaveData[] = [];

  departmentData: DepartmentLeaveData[] = [];

  teamAvailability: any[] = [];

  recentLeaves: any[] = [];

  maxMonthly = 0;

  maxDeptLeaves = 0;

public barChartOptions = {} as BarChartOptions;
public donutChartOptions = {} as DonutChartOptions;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private leaveService: LeaveService,
    private exportService: ExportService

  ) {



    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';

    this.barChartOptions = {
      series: [
        {
          name: 'Approved',
          data: [8, 12, 9, 15, 18, 20, 16, 13, 19, 17, 14, 10]
        },
        {
          name: 'Pending',
          data: [3, 5, 2, 4, 5, 6, 3, 2, 5, 4, 3, 2]
        },
        {
          name: 'Rejected',
          data: [1, 2, 1, 2, 3, 2, 1, 1, 2, 2, 1, 1]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '45%'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: [
  "#22C55E", // Approved (Green)
  "#F59E0B", // Pending (Orange)
  "#EF4444"  // Rejected (Red)

      ],
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
      },
      legend: {
        position: 'top'
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
  bar: {
    borderRadius: 8,
    columnWidth: "45%",
    distributed: false
              }
            }
          }
        }
      ]
    };

    this.donutChartOptions = {
      series: [80, 65, 52, 45, 38],
      chart: {
        type: 'donut',
        height: 340
      },
      labels: [
        'Engineering',
        'HR',
        'Finance',
        'Marketing',
        'Sales'
      ],
      colors:[
"#2563EB",
"#10B981",
"#F59E0B",
"#8B5CF6",
"#06B6D4",
"#EF4444",
"#14B8A6",
"#F97316",
"#6366F1",
"#84CC16"
],
      legend:{
    position:"bottom",
    fontSize:"13px"
},
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions:{
    pie:{
        donut:{
            size:"72%"
        }
    }
}

          }
        }
      ]
    };
  }
 downloadReport(): void {
  this.exportService.exportCSV();
}
  ngOnInit(): void {
  this.updateGreeting();
  this.loadData();
}

  ngAfterViewInit(): void {}

  loadData(): void {

    this.dashboardService.getStats().subscribe(stats => {

      this.statCards = [
  {
    label: 'Employees',
    value: 100,
    icon: 'groups',
    gradient: 'linear-gradient(135deg,#2563EB,#1E40AF)'
  },
  {
    label: 'Departments',
    value: 10,
    icon: 'apartment',
    gradient: 'linear-gradient(135deg,#10B981,#059669)'
  },
  {
    label: 'Pending Approvals',
    value: stats.pendingRequests,
    icon: 'pending_actions',
    gradient: 'linear-gradient(135deg,#F59E0B,#D97706)'
  },
  {
    label: 'Approved',
    value: stats.approvedLeaves,
    icon: 'verified',
    gradient: 'linear-gradient(135deg,#22C55E,#16A34A)'
  },
  {
    label: 'Attendance',
    value: stats.monthlyAttendance + '%',
    icon: 'trending_up',
    gradient: 'linear-gradient(135deg,#06B6D4,#0891B2)'
  },
  {
    label: 'On Leave Today',
    value: stats.teamOnLeave,
    icon: 'beach_access',
    gradient: 'linear-gradient(135deg,#8B5CF6,#7C3AED)'
  }
];
    });

    this.dashboardService.getMonthlyLeaveData().subscribe(data => {

      this.monthlyData = data;

      this.maxMonthly = Math.max(
        ...data.map(d => Math.max(d.approved, d.pending, d.rejected))
      );

      this.barChartOptions = {
        ...this.barChartOptions,
        series: [
          {
            name: 'Approved',
            data: data.map(d => d.approved)
          },
          {
            name: 'Pending',
            data: data.map(d => d.pending)
          },
          {
            name: 'Rejected',
            data: data.map(d => d.rejected)
          }
        ],
        xaxis: {
          categories: data.map(d => d.month)
        }
      };

    });

    this.dashboardService.getDepartmentLeaveData().subscribe(data => {

      this.departmentData = data;

      this.maxDeptLeaves = Math.max(
        ...data.map(d => d.totalLeaves)
      );

      this.donutChartOptions = {
        ...this.donutChartOptions,
        series: data.map(d => d.totalLeaves),
        labels: data.map(d => d.department)
      };

    });

        this.dashboardService.getTeamAvailability().subscribe(data => {
      this.teamAvailability = data;
    });

    const allLeaves = this.leaveService.leavesSubject.value;

    const recent = allLeaves
      .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate))
      .slice(0, 5)
      .map(l => ({
        employeeName: l.employeeName,
        leaveType: l.leaveType,
        days: l.days,
        status: l.status,
        appliedDate: l.appliedDate
      }));

    this.recentLeaves =
      recent.length > 0
        ? recent
        : [
            {
              employeeName: 'Priya Sharma',
              leaveType: 'Annual Leave',
              days: 3,
              status: 'Approved',
              appliedDate: '2026-07-20'
            },
            {
              employeeName: 'Amit Kumar',
              leaveType: 'Sick Leave',
              days: 2,
              status: 'Pending',
              appliedDate: '2026-07-22'
            },
            {
              employeeName: 'Sneha Reddy',
              leaveType: 'Casual Leave',
              days: 1,
              status: 'Approved',
              appliedDate: '2026-07-18'
            },
            {
              employeeName: 'Vikram Singh',
              leaveType: 'Comp Off',
              days: 1,
              status: 'Rejected',
              appliedDate: '2026-07-25'
            },
            {
              employeeName: 'Ananya Patel',
              leaveType: 'Annual Leave',
              days: 5,
              status: 'Pending',
              appliedDate: '2026-07-26'
            }
          ];
  }

  getBarHeight(value: number, max: number): string {
    if (max === 0) {
      return '0%';
    }

    return Math.max((value / max) * 100, 4) + '%';
  }

  getDeptWidth(value: number, max: number): string {
    if (max === 0) {
      return '0%';
    }

    return Math.max((value / max) * 100, 5) + '%';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Approved':
        return 'check_circle';

      case 'Pending':
        return 'hourglass_empty';

      case 'Rejected':
        return 'cancel';

      default:
        return 'info';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved':
        return '#2563EB';

      case 'Pending':
        return '#F59E0B';

      case 'Rejected':
        return '#EF4444';

      default:
        return '#64748B';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';

      case 'Pending':
        return 'pending';

      case 'Rejected':
        return 'rejected';

      default:
        return 'default';
    }
  }

  getAttendanceColor(value: number): string {
    if (value >= 95) {
      return '#2563EB';
    }

    if (value >= 85) {
      return '#3B82F6';
    }

    if (value >= 70) {
      return '#60A5FA';
    }

    return '#93C5FD';
  }
  private updateGreeting(): void {

  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    this.greeting = 'Good Morning';
  } else if (hour < 17) {
    this.greeting = 'Good Afternoon';
  } else {
    this.greeting = 'Good Evening';
  }

  this.currentDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  this.currentTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

}

  refreshDashboard(): void {
    this.loadData();
  }

  trackByStat(index: number, item: any): string {
    return item.label;
  }

  trackByDepartment(index: number, item: any): string {
    return item.department;
  }

  trackByEmployee(index: number, item: any): string {
    return item.employeeName;
  }

  trackByRecent(index: number, item: any): string {
    return item.employeeName + item.appliedDate;
  }
}
