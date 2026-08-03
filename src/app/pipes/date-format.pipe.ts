import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | undefined, format: string = 'medium'): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    switch (format) {
      case 'short':
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      case 'medium':
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      case 'full':
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      case 'iso':
        return value;
      default:
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  }
}
