import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  constructor(private leaveService: LeaveService) {}

  exportCSV() {

  this.leaveService.getAllLeaves().subscribe(leaves => {

    const headers = [
  'LeaveID',
  'EmployeeID',
  'EmployeeName',
  'Department',
  'LeaveType',
  'StartDate',
  'EndDate',
  'Days',
  'HalfDay',
  'Status',
  'Reason',
  'AppliedDate',
  'ApprovedBy',
  'ApprovedDate',
  'RejectionReason'
];

   const rows = leaves.map(l => [
  l.id,
  l.employeeId,
  l.employeeName,
  l.department,
  l.leaveType,
  l.startDate,
  l.endDate,
  l.days,
  l.halfDay,
  l.status,
  l.reason,
  l.appliedDate,
  l.approvedBy ?? '',
  l.approvedDate ?? '',
  l.rejectionReason ?? ''
]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'leave-data.csv';
    a.click();

    window.URL.revokeObjectURL(url);

    alert(
`Leave data exported successfully!

Next Steps:

1. Open Power BI
2. Refresh the dataset
3. Dashboard updates automatically`
    );

  });

}

}
