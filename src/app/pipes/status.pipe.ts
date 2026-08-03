import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusBadge', standalone: true })
export class StatusBadgePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      case 'Pending': return 'pending';
      case 'Cancelled': return 'cancelled';
      default: return 'default';
    }
  }
}
