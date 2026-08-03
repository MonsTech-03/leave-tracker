import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <div>
          <h2>Notifications</h2>
          <p>{{unreadCount}} unread notifications</p>
        </div>
        <button mat-stroked-button (click)="markAllRead()" *ngIf="unreadCount > 0">
          <mat-icon>done_all</mat-icon> Mark All Read
        </button>
      </div>

      <div class="notification-list">
        <div class="notification-item" *ngFor="let notif of notifications"
             [class.unread]="!notif.isRead">
          <div class="notif-icon" [class]="notif.type.toLowerCase().replace(' ', '-')">
            <mat-icon>{{getIcon(notif.type)}}</mat-icon>
          </div>
          <div class="notif-content">
            <p class="notif-message">{{notif.message}}</p>
            <span class="notif-date">{{notif.date}}</span>
          </div>
          <button mat-icon-button *ngIf="!notif.isRead" (click)="markRead(notif.id)" class="mark-read-btn">
            <mat-icon>done</mat-icon>
          </button>
        </div>
      </div>

      <div class="empty-state" *ngIf="notifications.length === 0">
        <mat-icon>notifications_none</mat-icon>
        <p>No notifications yet</p>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

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

    .notification-list {
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      overflow: hidden;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s;
    }

    .notification-item:hover {
      background: #fafbff;
    }

    .notification-item.unread {
      background: #f5f7ff;
      border-left: 3px solid #1a237e;
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notif-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notif-icon.leaveapproved { background: #E8F5E9; }
    .notif-icon.leaveapproved mat-icon { color: #4CAF50; }
    .notif-icon.leaverejected { background: #FFEBEE; }
    .notif-icon.leaverejected mat-icon { color: #F44336; }
    .notif-icon.leavesubmitted { background: #E3F2FD; }
    .notif-icon.leavesubmitted mat-icon { color: #2196F3; }
    .notif-icon.holidayreminder { background: #FFF3E0; }
    .notif-icon.holidayreminder mat-icon { color: #FF9800; }
    .notif-icon.birthdayreminder { background: #FCE4EC; }
    .notif-icon.birthdayreminder mat-icon { color: #E91E63; }
    .notif-icon.upcomingleave { background: #F3E5F5; }
    .notif-icon.upcomingleave mat-icon { color: #9C27B0; }

    .notif-content {
      flex: 1;
    }

    .notif-message {
      margin: 0;
      font-size: 14px;
      color: #333;
    }

    .notif-date {
      font-size: 12px;
      color: #999;
    }

    .mark-read-btn mat-icon {
      color: #4CAF50;
    }

    @media (max-width: 480px) {
      .notification-item { padding: 12px; gap: 12px; }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.initialize();
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(notifs => {
      this.notifications = notifs.sort((a, b) => b.date.localeCompare(a.date));
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    });
  }

  markRead(id: string): void {
    this.notificationService.markAsRead(id);
    this.loadNotifications();
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead();
    this.loadNotifications();
  }

  getIcon(type: string): string {
    switch (type) {
      case 'Leave Approved': return 'check_circle';
      case 'Leave Rejected': return 'cancel';
      case 'Leave Submitted': return 'send';
      case 'Holiday Reminder': return 'celebration';
      case 'Birthday Reminder': return 'cake';
      case 'Upcoming Leave': return 'event';
      default: return 'notifications';
    }
  }
}
