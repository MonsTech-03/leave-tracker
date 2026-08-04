import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  constructor(private exportService: ExportService) {}

  exportCSV() {
  this.exportService.exportCSV();
}
}
