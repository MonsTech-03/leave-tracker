import { Employee, Department, Holiday, LeaveRequest, LeaveBalance, LeaveType, LeaveStatus, HolidayType } from '../../models';

// ============================================
// Name Pools
// ============================================
const firstNames = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Karan', 'Deepa',
  'Arjun', 'Meera', 'Rohan', 'Kavita', 'Siddharth', 'Nisha', 'Aditya', 'Pooja',
  'Nikhil', 'Swati', 'Rajesh', 'Anjali', 'Manish', 'Divya', 'Sanjay', 'Rekha',
  'Vishal', 'Shruti', 'Akash', 'Neha', 'Pradeep', 'Sunita', 'Gaurav', 'Ritu',
  'Suresh', 'Preeti', 'Mahesh', 'Ashwini', 'Dinesh', 'Madhuri', 'Rakesh', 'Sonal',
  'Ashish', 'Pallavi', 'Harish', 'Shweta', 'Mukesh', 'Sakshi', 'Vinod', 'Seema',
  'Santosh', 'Asha', 'Prakash', 'Meena', 'Yogesh', 'Kamini', 'Dheeraj', 'Usha',
  'Naresh', 'Sarita', 'Jayesh', 'Aarti', 'Praveen', 'Shalini', 'Arun', 'Geeta',
  'Sachin', 'Reema', 'Ravindra', 'Snehal', 'Umesh', 'Varsha', 'Ganesh', 'Ruchi',
  'Prashant', 'Lata', 'Subhash', 'Aparna', 'Mahendra', 'Jyoti', 'Nandkishor', 'Smita',
  'Harish', 'Kiran', 'Sushil', 'Vandana', 'Nitin', 'Pratibha', 'Mohan', 'Annapurna',
  'Ramesh', 'Shobha', 'Kishore', 'Nirmala', 'Sunil', 'Bharati', 'Rajendra', 'Vidya',
  'Lokesh', 'Shilpa', 'Chetan', 'Rashmi', 'Pranav', 'Suniti', 'Yashwant', 'Sushila'
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Iyer',
  'Mehta', 'Joshi', 'Verma', 'Chauhan', 'Mishra', 'Pandey', 'Saxena', 'Agarwal',
  'Bhatia', 'Kapoor', 'Arora', 'Chopra', 'Gill', 'Malhotra', 'Shah', 'Desai',
  'Pillai', 'Menon', 'Rao', 'Kulkarni', 'Deshpande', 'Jadhav', 'Kamble', 'Patil',
  'Gaikwad', 'More', 'Salunkhe', 'Bhosale', 'Kulkarni', 'Shinde', 'Jadhav', 'More',
  'Chandra', 'Mukherjee', 'Banerjee', 'Chatterjee', 'Das', 'Ghosh', 'Roy', 'Sen',
  'Bose', 'Dutta', 'Sarkar', 'Mandal', 'Biswas', 'Chakraborty', 'Dey', 'Haldar'
];

const departments = [
  { id: 'DEPT001', name: 'Engineering', location: 'Bangalore' },
  { id: 'DEPT002', name: 'Human Resources', location: 'Mumbai' },
  { id: 'DEPT003', name: 'Finance', location: 'Delhi' },
  { id: 'DEPT004', name: 'Marketing', location: 'Mumbai' },
  { id: 'DEPT005', name: 'Sales', location: 'Bangalore' },
  { id: 'DEPT006', name: 'Operations', location: 'Delhi' },
  { id: 'DEPT007', name: 'Quality Assurance', location: 'Pune' },
  { id: 'DEPT008', name: 'Product Management', location: 'Bangalore' },
  { id: 'DEPT009', name: 'Legal & Compliance', location: 'Delhi' },
  { id: 'DEPT010', name: 'Research & Development', location: 'Pune' }
];

const designations = [
  'Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Project Manager',
  'Business Analyst', 'HR Executive', 'Finance Manager', 'Marketing Executive',
  'Sales Representative', 'Operations Manager', 'QA Engineer', 'Product Manager',
  'Legal Advisor', 'Research Analyst', 'Team Lead', 'Associate Consultant',
  'Data Scientist', 'DevOps Engineer', 'UI/UX Designer', 'Business Development Manager'
];

const leaveTypes: LeaveType[] = [
  LeaveType.Annual, LeaveType.Sick, LeaveType.Casual, LeaveType.WorkFromHome,
  LeaveType.CompOff, LeaveType.LossOfPay
];

const reasons = [
  'Family function', 'Medical appointment', 'Personal work', 'Vacation trip',
  'Sick', 'Religious festival', 'Child care', 'Home renovation', 'Wedding ceremony',
  'Health checkup', 'Government work', 'Moving house', 'Child\'s school function',
  'Emergency', 'Mental health day', 'Travel', 'Anniversary celebration',
  'Dental appointment', 'Doctor visit', 'Family medical emergency', 'Housewarming'
];

function randomId(prefix: string, index: number): string {
  return `${prefix}${String(index).padStart(4, '0')}`;
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// Generate Employees
// ============================================
export function generateEmployees(): Employee[] {
  const employees: Employee[] = [];

  // HR Users
  for (let i = 1; i <= 5; i++) {
    const dept = randomItem(departments);
    employees.push({
      id: randomId('EMP', i),
      firstName: firstNames[i],
      lastName: lastNames[i],
      email: `hr${i}@company.com`,
      phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
      department: dept.name,
      departmentId: dept.id,
      designation: 'HR Manager',
      managerId: '',
      location: dept.location,
      joiningDate: randomDate(new Date(2018, 0, 1), new Date(2024, 0, 1)),
      photoUrl: '',
      gender: i % 2 === 0 ? 'Male' : 'Female',
      role: 'hr',
      isActive: true,
      birthday: `${new Date().getFullYear()}-${String(randomBetween(1, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      emergencyContact: { name: 'Parent', phone: '+91 98765 43210', relation: 'Father' }
    });
  }

  // Managers
  for (let i = 6; i <= 8; i++) {
    const dept = departments[i - 6];
    employees.push({
      id: randomId('EMP', i),
      firstName: firstNames[i],
      lastName: lastNames[i],
      email: `manager${i - 5}@company.com`,
      phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
      department: dept.name,
      departmentId: dept.id,
      designation: 'Department Manager',
      managerId: '',
      location: dept.location,
      joiningDate: randomDate(new Date(2016, 0, 1), new Date(2022, 0, 1)),
      photoUrl: '',
      gender: i % 2 === 0 ? 'Male' : 'Female',
      role: 'manager',
      isActive: true,
      birthday: `${new Date().getFullYear()}-${String(randomBetween(1, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      emergencyContact: { name: 'Spouse', phone: '+91 98765 43211', relation: 'Wife' }
    });
  }

  // Regular Employees
  for (let i = 9; i <= 100; i++) {
    const dept = randomItem(departments);
    const managerId = randomId('EMP', randomBetween(6, 8));
    employees.push({
      id: randomId('EMP', i),
      firstName: firstNames[i % firstNames.length],
      lastName: lastNames[i % lastNames.length],
      email: `employee${i}@company.com`,
      phone: `+91 ${randomBetween(70000, 99999)} ${randomBetween(10000, 99999)}`,
      department: dept.name,
      departmentId: dept.id,
      designation: randomItem(designations),
      managerId: managerId,
      location: dept.location,
      joiningDate: randomDate(new Date(2019, 0, 1), new Date(2024, 11, 31)),
      photoUrl: '',
      gender: i % 2 === 0 ? 'Male' : 'Female',
      role: 'employee',
      isActive: true,
      birthday: `${new Date().getFullYear()}-${String(randomBetween(1, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      emergencyContact: { name: 'Parent', phone: '+91 98765 43210', relation: 'Father' }
    });
  }

  return employees;
}

// ============================================
// Generate Departments
// ============================================
export function generateDepartments(employees: Employee[]): Department[] {
  return departments.map(dept => {
    const deptEmployees = employees.filter(e => e.departmentId === dept.id);
    const managers = deptEmployees.filter(e => e.role === 'manager');
    return {
      id: dept.id,
      name: dept.name,
      headId: managers.length > 0 ? managers[0].id : deptEmployees[0]?.id || '',
      headName: managers.length > 0 ? managers[0].firstName : deptEmployees[0]?.firstName || '',
      employeeCount: deptEmployees.length,
      location: dept.location
    };
  });
}

// ============================================
// Generate Holidays
// ============================================
export function generateHolidays(): Holiday[] {
  const year = new Date().getFullYear();
  const holidays: Holiday[] = [
    { id: 'HOL001', name: "New Year's Day", date: `${year}-01-01`, type: HolidayType.National, description: 'New Year celebration', isOptional: false },
    { id: 'HOL002', name: 'Republic Day', date: `${year}-01-26`, type: HolidayType.National, description: 'Indian Republic Day', isOptional: false },
    { id: 'HOL003', name: 'Maha Shivaratri', date: `${year}-02-26`, type: HolidayType.Festival, description: 'Festival of Lord Shiva', isOptional: false },
    { id: 'HOL004', name: 'Holi', date: `${year}-03-14`, type: HolidayType.Festival, description: 'Festival of Colors', isOptional: false },
    { id: 'HOL005', name: 'Good Friday', date: `${year}-04-03`, type: HolidayType.Festival, description: 'Christian holiday', isOptional: false },
    { id: 'HOL006', name: 'Eid al-Fitr', date: `${year}-03-31`, type: HolidayType.Festival, description: 'End of Ramadan', isOptional: false },
    { id: 'HOL007', name: 'Dr. Ambedkar Jayanti', date: `${year}-04-14`, type: HolidayType.National, description: 'Dr. B.R. Ambedkar Birthday', isOptional: false },
    { id: 'HOL008', name: 'Akshaya Tritiya', date: `${year}-04-29`, type: HolidayType.Festival, description: 'Auspicious day', isOptional: true },
    { id: 'HOL009', name: 'Rama Navami', date: `${year}-04-06`, type: HolidayType.Festival, description: 'Lord Rama Birthday', isOptional: true },
    { id: 'HOL010', name: 'Independence Day', date: `${year}-08-15`, type: HolidayType.National, description: 'Indian Independence Day', isOptional: false },
    { id: 'HOL011', name: 'Raksha Bandhan', date: `${year}-08-09`, type: HolidayType.Festival, description: 'Brother-Sister bond', isOptional: true },
    { id: 'HOL012', name: 'Janmashtami', date: `${year}-08-26`, type: HolidayType.Festival, description: 'Lord Krishna Birthday', isOptional: false },
    { id: 'HOL013', name: 'Gandhi Jayanti', date: `${year}-10-02`, type: HolidayType.National, description: 'Mahatma Gandhi Birthday', isOptional: false },
    { id: 'HOL014', name: 'Dussehra', date: `${year}-10-01`, type: HolidayType.Festival, description: 'Vijayadashami', isOptional: false },
    { id: 'HOL015', name: 'Diwali', date: `${year}-10-20`, type: HolidayType.Festival, description: 'Festival of Lights', isOptional: false },
    { id: 'HOL016', name: 'Bhai Dooj', date: `${year}-10-23`, type: HolidayType.Festival, description: 'Brother-Sister festival', isOptional: true },
    { id: 'HOL017', name: 'Guru Nanak Jayanti', date: `${year}-11-04`, type: HolidayType.Festival, description: 'Sikh festival', isOptional: false },
    { id: 'HOL018', name: 'Christmas', date: `${year}-12-25`, type: HolidayType.Festival, description: 'Christmas Day', isOptional: false },
    { id: 'HOL019', name: 'Company Annual Day', date: `${year}-06-15`, type: HolidayType.Company, description: 'Company celebration', isOptional: false },
    { id: 'HOL020', name: 'Founders Day', date: `${year}-09-01`, type: HolidayType.Company, description: 'Company founding celebration', isOptional: false },
    { id: 'HOL021', name: 'Regional Holiday', date: `${year}-05-01`, type: HolidayType.Restricted, description: 'Optional restricted holiday', isOptional: true },
    { id: 'HOL022', name: 'Regional Holiday 2', date: `${year}-11-01`, type: HolidayType.Restricted, description: 'Optional restricted holiday', isOptional: true },
  ];
  return holidays;
}

// ============================================
// Generate Leave Requests
// ============================================
export function generateLeaveRequests(employees: Employee[], holidays: Holiday[]): LeaveRequest[] {
  const leaves: LeaveRequest[] = [];
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, 0, 1);
  let id = 1;

  employees.forEach(employee => {
    if (employee.role === 'hr') return; // HR don't apply leaves in this mock

    const numLeaves = randomBetween(3, 10);
    for (let j = 0; j < numLeaves; j++) {
      const leaveType = randomItem(leaveTypes);
      const startDate = randomDate(twoYearsAgo, now);
      const days = randomBetween(1, 5);
      const start = new Date(startDate);
      const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      const statuses = [LeaveStatus.Approved, LeaveStatus.Approved, LeaveStatus.Approved, LeaveStatus.Rejected, LeaveStatus.Pending];
      const status = randomItem(statuses);

      leaves.push({
        id: randomId('LV', id++),
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        leaveType,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        days,
        halfDay: Math.random() > 0.85,
        reason: randomItem(reasons),
        status,
        appliedDate: randomDate(new Date(start.getTime() - 14 * 24 * 60 * 60 * 1000), start),
        approvedBy: status === LeaveStatus.Approved ? randomItem(employees.filter(e => e.role === 'manager')).id : undefined,
        approvedDate: status === LeaveStatus.Approved ? startDate : undefined,
        rejectionReason: status === LeaveStatus.Rejected ? 'Project deadline conflict' : undefined,
        department: employee.department
      });
    }
  });

  return leaves;
}

// ============================================
// Generate Leave Balances
// ============================================
export function generateLeaveBalances(employees: Employee[], leaves: LeaveRequest[]): LeaveBalance[] {
  const balances: LeaveBalance[] = [];
  const year = new Date().getFullYear().toString();

  employees.forEach(employee => {
    if (employee.role === 'hr') return;

    const empLeaves = leaves.filter(l => l.employeeId === employee.id && l.startDate.startsWith(year));

    [LeaveType.Annual, LeaveType.Sick, LeaveType.Casual, LeaveType.WorkFromHome, LeaveType.CompOff, LeaveType.LossOfPay].forEach(type => {
      const allocated = type === LeaveType.Annual ? 24 : type === LeaveType.Sick ? 12 : type === LeaveType.Casual ? 10 : type === LeaveType.CompOff ? 5 : type === LeaveType.WorkFromHome ? 100 : 5;
      const consumed = empLeaves.filter(l => l.leaveType === type && l.status === LeaveStatus.Approved).reduce((sum, l) => sum + l.days, 0);
      balances.push({
        employeeId: employee.id,
        leaveType: type,
        allocated,
        consumed: Math.min(consumed, allocated),
        remaining: Math.max(allocated - consumed, 0)
      });
    });
  });

  return balances;
}

// ============================================
// Generate Notifications
// ============================================
export function generateNotifications(employees: Employee[], leaves: LeaveRequest[]): any[] {
  const notifications: any[] = [];
  const messages = [
    { type: 'LeaveApproved', msg: 'Your leave request has been approved by your manager.' },
    { type: 'LeaveRejected', msg: 'Your leave request has been rejected due to project deadline.' },
    { type: 'LeaveSubmitted', msg: 'New leave request submitted. Please review.' },
    { type: 'HolidayReminder', msg: 'Upcoming holiday: Republic Day on January 26.' },
    { type: 'BirthdayReminder', msg: 'Today is a team member\'s birthday! Send wishes.' },
    { type: 'UpcomingLeave', msg: 'You have a leave scheduled for next week.' }
  ];

  employees.slice(0, 20).forEach((emp, idx) => {
    const msg = messages[idx % messages.length];
    notifications.push({
      id: `NOT${String(idx + 1).padStart(4, '0')}`,
      type: msg.type,
      message: msg.msg,
      date: randomDate(new Date(2025, 0, 1), new Date()),
      isRead: Math.random() > 0.4,
      employeeId: emp.id,
      link: '/leave/history'
    });
  });

  return notifications;
}
