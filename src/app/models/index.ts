// ============================================
// Employee Models
// ============================================
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  departmentId: string;
  designation: string;
  managerId: string;
  location: string;
  joiningDate: string;
  photoUrl: string;
  gender: 'Male' | 'Female';
  role: 'employee' | 'manager' | 'hr';
  isActive: boolean;
  birthday: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

// ============================================
// Leave Models
// ============================================
export enum LeaveType {
  Annual = 'Annual Leave',
  Sick = 'Sick Leave',
  Casual = 'Casual Leave',
  WorkFromHome = 'Work From Home',
  CompOff = 'Comp Off',
  Maternity = 'Maternity Leave',
  Paternity = 'Paternity Leave',
  LossOfPay = 'Loss of Pay'
}

export enum LeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled'
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  halfDay: boolean;
  reason: string;
  attachment?: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  department: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveType: LeaveType;
  allocated: number;
  consumed: number;
  remaining: number;
}

// ============================================
// Department Models
// ============================================
export interface Department {
  id: string;
  name: string;
  headId: string;
  headName: string;
  employeeCount: number;
  location: string;
}

// ============================================
// Holiday Models
// ============================================
export enum HolidayType {
  National = 'National Holiday',
  Festival = 'Festival Holiday',
  Company = 'Company Holiday',
  Restricted = 'Restricted Holiday'
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: HolidayType;
  description: string;
  isOptional: boolean;
}

// ============================================
// Notification Models
// ============================================
export enum NotificationType {
  LeaveApproved = 'Leave Approved',
  LeaveRejected = 'Leave Rejected',
  LeaveSubmitted = 'Leave Submitted',
  HolidayReminder = 'Holiday Reminder',
  BirthdayReminder = 'Birthday Reminder',
  UpcomingLeave = 'Upcoming Leave'
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}

// ============================================
// Auth Models
// ============================================
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'hr';
  department: string;
  departmentId: string;
  photoUrl: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============================================
// Dashboard Models
// ============================================
export interface DashboardStats {
  remainingLeave: number;
  leaveTaken: number;
  pendingRequests: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  upcomingHolidays: number;
  monthlyAttendance: number;
  teamOnLeave: number;
}

export interface DepartmentLeaveData {
  department: string;
  totalLeaves: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface MonthlyLeaveData {
  month: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

// ============================================
// Export Models (Power BI)
// ============================================
export interface LeaveExportData {
  LeaveID: string;
  EmployeeID: string;
  EmployeeName: string;
  Department: string;
  LeaveType: string;
  StartDate: string;
  EndDate: string;
  Days: number;
  Status: string;
  AppliedDate: string;
  ManagerName: string;
  Reason: string;
}
