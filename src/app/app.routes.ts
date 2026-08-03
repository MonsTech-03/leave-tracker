import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'employee-dashboard',
    loadComponent: () =>
      import('./features/dashboard/employee-dashboard.component')
        .then(m => m.EmployeeDashboardComponent),
    canActivate: [authGuard]
},

{
  path: 'manager-dashboard',
  loadComponent: () =>
    import('./features/dashboard/manager-dashboard.component')
      .then(m => m.ManagerDashboardComponent)
},
  {
    path: 'leave',
    children: [
      {
        path: 'apply',
        loadComponent: () => import('./features/leave/apply/apply-leave.component').then(m => m.ApplyLeaveComponent),
        canActivate: [authGuard]
      },
      {
        path: 'history',
        loadComponent: () => import('./features/leave/history/leave-history.component').then(m => m.LeaveHistoryComponent),
        canActivate: [authGuard]
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/leave/calendar/leave-calendar.component').then(m => m.LeaveCalendarComponent),
        canActivate: [authGuard]
      },
      {
        path: 'pending',
        loadComponent: () => import('./features/leave/pending/pending-approvals.component').then(m => m.PendingApprovalsComponent),
        canActivate: [authGuard],
        data: { role: 'manager' }
      }
    ]
  },
  {
    path: 'employee',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/employee/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
      },
      {
        path: 'list',
        loadComponent: () => import('./features/employee/list/employee-list.component').then(m => m.EmployeeListComponent),
        canActivate: [authGuard],
        data: { role: 'manager' }
      }
    ]
  },
  {
    path: 'holidays',
    loadComponent: () => import('./features/holiday/holiday.component').then(m => m.HolidayComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'employees',
        loadComponent: () => import('./features/admin/employees/admin-employees.component').then(m => m.AdminEmployeesComponent),
        canActivate: [authGuard],
        data: { role: 'admin' }
      },
      {
        path: 'holidays',
        loadComponent: () => import('./features/admin/holidays/admin-holidays.component').then(m => m.AdminHolidaysComponent),
        canActivate: [authGuard],
        data: { role: 'admin' }
      },
      {
        path: 'leave-types',
        loadComponent: () => import('./features/admin/leave-types/admin-leave-types.component').then(m => m.AdminLeaveTypesComponent),
        canActivate: [authGuard],
        data: { role: 'admin' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [authGuard],
        data: { role: 'admin' }
      }
    ]
  },
  {
  path: 'reports',
  loadComponent: () =>
    import('./features/reports/reports.component')
      .then(m => m.ReportsComponent),
  canActivate: [authGuard]

  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
