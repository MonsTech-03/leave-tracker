# LeaveTrack Pro - Enterprise Leave Tracking Web Application

## Overview

LeaveTrack Pro is a professional, enterprise-grade Leave Tracking Web Application built with **Angular 21** and **Angular Material**. It features a complete mock data system with 100 employees, role-based access control, comprehensive leave management, Power BI data export, and a modern responsive UI with dark mode support.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 21 | Frontend Framework |
| Angular Material | 21 | UI Component Library |
| TypeScript | 5.x | Type-safe Development |
| SCSS | Latest | Styling with Custom Theme |
| Angular Router | 21 | SPA Navigation |
| Angular Animations | 21 | Smooth Transitions |

## Features

### Authentication & Role-Based Access

The application supports three user roles with distinct access levels:

| Role | Email | Password | Access |
|---|---|---|---|
| Employee | employee@company.com | 123456 | Apply leave, view own history, profile |
| Manager | manager@company.com | 123456 | All employee features + approve/reject leaves |
| HR Admin | hr@company.com | 123456 | Full access including admin panels and reports |

### Dashboard

- **8 Stat Cards**: Remaining Leave, Leave Taken, Pending Requests, Approved, Rejected, Upcoming Holidays, Team On Leave, Monthly Attendance
- **Monthly Leave Trend Chart**: Bar chart showing approved, pending, and rejected leaves per month
- **Department Overview**: Horizontal bar chart showing leave distribution across 10 departments
- **Team Availability**: Real-time employee availability status
- **Recent Leave Requests**: Latest 5 leave applications with status indicators

### Leave Management

- **Apply Leave**: Form with leave type selection, date range picker, half-day option, reason, and file attachment
- **Leave History**: Paginated table with filters for status and leave type, search functionality
- **Leave Calendar**: Monthly calendar view showing approved leaves and holidays
- **Pending Approvals** (Manager/HR): Table with approve/reject actions, bulk approval

### Employee Management

- **Employee Directory**: Grid view of all 100 employees with search and filter by department/location
- **Employee Profile**: Detailed view with personal info, leave balances, and recent leave history
- **Manage Employees** (HR Admin): CRUD operations for employee records

### Reports & Analytics

- **Leave Summary Report**: Full leave records table with all details
- **Department Report**: Leave data grouped by department
- **Employee Report**: Individual employee leave summaries
- **Manager Report**: Leave statistics by manager
- **Power BI Export**: Download CSV/Excel/PDF files for Power BI Desktop import
- **Export Formats**: CSV, Excel (.xlsx), PDF, and bulk data export

### Administration (HR Admin)

- **Manage Employees**: Add, edit, delete employee records
- **Manage Holidays**: Create and manage company holidays
- **Leave Types**: Configure leave types and allocations
- **Settings**: System configuration and preferences

### Additional Features

- **Notifications**: 10 notification types with read/unread tracking
- **Holiday Calendar**: National, Festival, Company, and Restricted holidays
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Search**: Global search across employees and leaves
- **100 Mock Employees**: Realistic Indian names across 10 departments
- **1000+ Leave Records**: Comprehensive mock leave data from 2024-2026

## Department Structure

| Department | Manager | Location |
|---|---|---|
| Engineering | Karan Nair | Bangalore |
| Human Resources | Deepa Iyer | Mumbai |
| Finance | Arjun Mehta | Delhi |
| Marketing | Kavita Chauhan | Bangalore |
| Sales | Pradeep Deshpande | Bangalore |
| Operations | Siddharth Mishra | Bangalore |
| Quality Assurance | Meera Joshi | Pune |
| Product Management | Nisha Pandey | Delhi |
| Legal & Compliance | Swati Kapoor | Delhi |
| Research & Development | Nikhil Bhatia | Pune |

## Project Structure

```
leave-tracker/
├── src/
│   ├── app/
│   │   ├── models/              # TypeScript interfaces and enums
│   │   ├── services/            # Business logic services
│   │   ├── guards/              # Route guards (auth)
│   │   ├── pipes/               # Custom pipes (date, status)
│   │   ├── shared/components/   # Header, Sidebar, Shared UI
│   │   ├── assets/mock-data/    # Mock data generator
│   │   └── features/
│   │       ├── login/           # Login page
│   │       ├── dashboard/       # Dashboard with charts
│   │       ├── leave/
│   │       │   ├── apply/       # Apply leave form
│   │       │   ├── history/     # Leave history
│   │       │   ├── calendar/    # Leave calendar
│   │       │   └── pending/     # Pending approvals
│   │       ├── employee/
│   │       │   ├── profile/     # Employee profile
│   │       │   └── list/        # Employee directory
│   │       ├── holiday/         # Holiday list
│   │       ├── notifications/   # Notifications
│   │       ├── reports/         # Reports & export
│   │       └── admin/
│   │           ├── employees/   # Admin employee CRUD
│   │           ├── holidays/    # Admin holiday CRUD
│   │           ├── leave-types/ # Admin leave type config
│   │           └── settings/    # System settings
│   ├── styles.scss              # Global theme styles
│   └── main.ts                  # Bootstrap entry
└── angular.json                 # Angular configuration
```

## Getting Started

### Prerequisites

- Node.js 22.x (recommended via nvm)
- npm 10.x

### Installation

```bash
cd leave-tracker
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Production Build

```bash
npm run build --configuration production
```

The build output will be in the `dist/leave-tracker/` directory.

## Design Highlights

- **Color Scheme**: Deep indigo (#1A237E) primary with vibrant accent colors
- **Typography**: Clean, modern sans-serif with proper hierarchy
- **Cards**: Elevated cards with subtle shadows and rounded corners
- **Animations**: Smooth page transitions and hover effects
- **Dark Mode**: Full dark theme support with toggle
- **Responsive**: Mobile-first approach with breakpoints at 480px, 768px, 1024px

## License

This is a demonstration project built for educational and portfolio purposes.
