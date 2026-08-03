import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule, MatDividerModule, MatTooltipModule],
  template: `
    <nav class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo-area" *ngIf="!collapsed">
          <div class="app-icon">
            <mat-icon>business_center</mat-icon>
          </div>
          <div class="app-name">
            <h3>LeaveTrack</h3>
            <small>Enterprise Portal</small>
          </div>
        </div>
      </div>

      <div class="nav-section">
        <div class="nav-label" *ngIf="!collapsed">Main</div>
        <a *ngFor="let item of mainNav"
           [routerLink]="item.route"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}"
           class="nav-item"
           matTooltip="{{item.label}}"
           matTooltipPosition="right">
          <mat-icon>{{item.icon}}</mat-icon>
          <span *ngIf="!collapsed">{{item.label}}</span>
        </a>
      </div>

      <mat-divider *ngIf="hasLeaveSection"></mat-divider>

      <div class="nav-section" *ngIf="hasLeaveSection">
        <div class="nav-label" *ngIf="!collapsed">Leave</div>
        <a *ngFor="let item of leaveNav"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           matTooltip="{{item.label}}"
           matTooltipPosition="right">
          <mat-icon>{{item.icon}}</mat-icon>
          <span *ngIf="!collapsed">{{item.label}}</span>
        </a>
      </div>

      <mat-divider *ngIf="showAdmin"></mat-divider>

      <div class="nav-section" *ngIf="showAdmin">
        <div class="nav-label" *ngIf="!collapsed">Administration</div>
        <a *ngFor="let item of adminNav"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           matTooltip="{{item.label}}"
           matTooltipPosition="right">
          <mat-icon>{{item.icon}}</mat-icon>
          <span *ngIf="!collapsed">{{item.label}}</span>
        </a>
      </div>

      <div class="sidebar-footer" *ngIf="!collapsed">
        <p>v2.0.0</p>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e8eaf6;
      position: fixed;
      top: 64px;
      left: 0;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 900;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar-header {
      padding: 16px;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .app-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #1a237e, #283593);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .app-icon mat-icon {
      color: white;
      font-size: 20px;
    }

    .app-name h3 {
      margin: 0;
      font-size: 16px;
      color: #1a237e;
      font-weight: 700;
    }

    .app-name small {
      font-size: 10px;
      color: #90A4AE;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .nav-section {
      padding: 8px 0;
    }

    .nav-label {
      padding: 8px 20px;
      font-size: 11px;
      font-weight: 600;
      color: #90A4AE;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: #546E7A;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: #E8EAF6;
      color: #1a237e;
    }

    .nav-item.active {
      background: #E8EAF6;
      color: #1a237e;
      border-left-color: #1a237e;
      font-weight: 600;
    }

    .nav-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .sidebar-footer {
      margin-top: auto;
      padding: 16px 20px;
      color: #B0BEC5;
      font-size: 11px;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  userRole = '';

  mainNav: NavItem[] = [];


  leaveNav: NavItem[] = [
    { label: 'Apply Leave', icon: 'add_circle_outline', route: '/leave/apply', roles: ['employee', 'manager', 'hr'] },
    { label: 'Leave History', icon: 'history', route: '/leave/history', roles: ['employee', 'manager', 'hr'] },
    { label: 'Leave Calendar', icon: 'calendar_today', route: '/leave/calendar', roles: ['employee', 'manager', 'hr'] },
    { label: 'Pending Approvals', icon: 'pending_actions', route: '/leave/pending', roles: ['manager', 'hr'] },
  ];

  adminNav: NavItem[] = [
    { label: 'Manage Employees', icon: 'manage_accounts', route: '/admin/employees', roles: ['hr'] },
    { label: 'Manage Holidays', icon: 'event', route: '/admin/holidays', roles: ['hr'] },
    { label: 'Leave Types', icon: 'category', route: '/admin/leave-types', roles: ['hr'] },
    { label: 'Reports', icon: 'assessment', route: '/reports', roles: ['hr'] },
    { label: 'Settings', icon: 'settings', route: '/admin/settings', roles: ['hr'] },
  ];

  get hasLeaveSection(): boolean {
    return true;
  }

  get showAdmin(): boolean {
    return this.userRole === 'hr';
  }

  constructor() {
    const saved = localStorage.getItem('leaveTrackerUser');
    if (saved) {
      this.userRole = JSON.parse(saved).role;
      switch (this.userRole) {

  case 'employee':
    this.mainNav = [
      { label: 'Dashboard', icon: 'dashboard', route: '/employee-dashboard', roles: ['employee'] },
      { label: 'My Profile', icon: 'person', route: '/employee/profile', roles: ['employee'] }
    ];
    break;

  case 'manager':
    this.mainNav = [
      { label: 'Dashboard', icon: 'dashboard', route: '/manager-dashboard', roles: ['manager'] },
      { label: 'My Profile', icon: 'person', route: '/employee/profile', roles: ['manager'] },
      { label: 'Employee List', icon: 'people', route: '/employee/list', roles: ['manager'] }
    ];
    break;

  case 'hr':
    this.mainNav = [
      { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: ['hr'] },
      { label: 'My Profile', icon: 'person', route: '/employee/profile', roles: ['hr'] },
      { label: 'Employee List', icon: 'people', route: '/employee/list', roles: ['hr'] }
    ];
    break;
}
    }

    // Filter nav items based on role

    this.leaveNav = this.leaveNav.filter(n => n.roles.includes(this.userRole));
    this.adminNav = this.adminNav.filter(n => n.roles.includes(this.userRole));
  }
}
