import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found">
      <div class="error-code">404</div>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon>
        Go to Dashboard
      </a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
    }
    .error-code {
      font-size: 120px;
      font-weight: 800;
      color: #1a237e;
      opacity: 0.15;
      line-height: 1;
    }
    h2 {
      font-size: 24px;
      color: #333;
      margin: 16px 0 8px;
    }
    p {
      color: #666;
      margin-bottom: 32px;
    }
    a {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class NotFoundComponent {}
