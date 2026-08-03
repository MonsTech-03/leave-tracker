import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatIconModule, MatButtonModule, MatMenuModule,
    MatBadgeModule, MatToolbarModule, MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <div class="toolbar-left">
        <button mat-icon-button (click)="toggleSidebar.emit()" class="menu-btn">
          <mat-icon>menu</mat-icon>
        </button>
        <div class="logo" (click)="navigateTo('/dashboard')">
  <mat-icon>business_center</mat-icon>
  <span>LeaveTrack Pro</span>
</div>
      </div>

      <div class="toolbar-center">
        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input type="text" placeholder="Search employees, leaves..." [(ngModel)]="searchQuery" (keyup.enter)="onSearch()">
        </div>
      </div>

      <div class="toolbar-right">
        <button mat-icon-button [matBadge]="unreadCount" matBadgeColor="warn" matBadgeSize="small"
                (click)="goToNotifications()" matTooltip="Notifications">
          <mat-icon>notifications_none</mat-icon>
        </button>

        <div class="theme-toggle">
          <button mat-icon-button (click)="toggleDarkMode.emit()" matTooltip="Toggle Dark Mode">
            <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>

        <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
          <div class="user-avatar">
            <span>{{ userInitials }}</span>
          </div>
          <span class="user-name">{{ currentUser?.name }}</span>
          <mat-icon>expand_more</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="navigateTo('/employee/profile')">
            <mat-icon>person</mat-icon>
            <span>My Profile</span>
          </button>
          <button mat-menu-item (click)="navigateTo('/notifications')">
            <mat-icon>notifications</mat-icon>
            <span>Notifications</span>
          </button>
          <button mat-menu-item *ngIf="isAdmin" (click)="navigateTo('/reports')">
            <mat-icon>assessment</mat-icon>
            <span>Reports</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      background: linear-gradient(135deg, #1a237e, #283593);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      height: 64px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .menu-btn {
      display: none;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
    }

    .logo mat-icon {
      color: #64B5F6;
    }

    .toolbar-center {
      flex: 1;
      max-width: 400px;
      margin: 0 24px;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 8px 16px;
      gap: 8px;
    }

    .search-box input {
      border: none;
      background: none;
      color: white;
      font-size: 14px;
      width: 100%;
      outline: none;
    }

    .search-box input::placeholder {
      color: rgba(255,255,255,0.6);
    }

    .search-box mat-icon {
      color: rgba(255,255,255,0.6);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-menu-btn {
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #42A5F5, #1E88E5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
    }

    .user-name {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .menu-btn { display: block; }
      .toolbar-center { display: none; }
      .user-name { display: none; }
    }
  `]
})
export class HeaderComponent {
  currentUser: any;
  searchQuery = '';
  unreadCount = 0;
  isDarkMode = false;
  isAdmin = false;

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleDarkMode = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'hr';
    });
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
  }

  get userInitials(): string {
    if (!this.currentUser?.name) return '?';
    return this.currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/employee/list'], { queryParams: { search: this.searchQuery } });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
