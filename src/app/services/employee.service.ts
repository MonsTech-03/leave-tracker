import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Employee, Department } from '../models';
import { generateEmployees, generateDepartments } from '../assets/mock-data/data-generator';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [];
  private departments: Department[] = [];
  private initialized = false;
  private readonly EMPLOYEE_KEY = 'ltp_employees';

  constructor() {}

  initialize(): void {
  if (this.initialized) return;

  this.initialized = true;

  const storedEmployees = localStorage.getItem(this.EMPLOYEE_KEY);

  if (storedEmployees) {
    this.employees = JSON.parse(storedEmployees);
  } else {
    this.employees = generateEmployees();

    localStorage.setItem(
      this.EMPLOYEE_KEY,
      JSON.stringify(this.employees)
    );
  }

  this.departments = generateDepartments(this.employees);
}

  getEmployees(): Employee[] {
    this.initialize();
    return this.employees;
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find(e => e.id === id);
  }

  getEmployeeByEmail(email: string): Employee | undefined {
    return this.getEmployees().find(e => e.email === email);
  }

  getEmployeesByDepartment(deptId: string): Employee[] {
    return this.getEmployees().filter(e => e.departmentId === deptId);
  }

  getEmployeesByManager(managerId: string): Employee[] {
    return this.getEmployees().filter(e => e.managerId === managerId);
  }

  searchEmployees(query: string): Employee[] {
    const q = query.toLowerCase();
    return this.getEmployees().filter(e =>
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    );
  }

  getDepartments(): Department[] {
    this.initialize();
    return this.departments;
  }

  getDepartmentById(id: string): Department | undefined {
    return this.getDepartments().find(d => d.id === id);
  }

  getManagerByEmployee(employeeId: string): Employee | undefined {
    const emp = this.getEmployeeById(employeeId);
    if (emp?.managerId) {
      return this.getEmployeeById(emp.managerId);
    }
    return undefined;
  }

  getDepartmentStats() {
    return this.getDepartments().map(dept => {
      const employees = this.getEmployeesByDepartment(dept.id);
      return {
        ...dept,
        totalEmployees: employees.length,
        managers: employees.filter(e => e.role === 'manager').length,
        employees: employees.filter(e => e.role === 'employee').length,
        hrStaff: employees.filter(e => e.role === 'hr').length
      };
    });
  }
}
