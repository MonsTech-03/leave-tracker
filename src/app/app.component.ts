import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-wrapper" [class.dark-mode]="isDarkMode">
      <div *ngIf="showLayout">
        <app-header
          (toggleSidebar)="sidebarOpen = !sidebarOpen"
          (toggleDarkMode)="toggleDarkMode()">
        </app-header>

        <div class="main-layout">
          <app-sidebar [collapsed]="sidebarCollapsed" [class.mobile-open]="sidebarOpen"></app-sidebar>

          <div class="overlay" *ngIf="sidebarOpen" (click)="sidebarOpen = false"></div>

          <main class="main-content">
            <div class="content-wrapper">
              <router-outlet></router-outlet>
            </div>
          </main>
        </div>
      </div>

      <div *ngIf="!showLayout">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .app-wrapper.dark-mode {
      background: #0f1923;
    }

    .main-layout {
      display: flex;
      margin-top: 64px;
      min-height: calc(100vh - 64px);
    }

    .main-content {
      flex: 1;
      margin-left: 250px;
      padding: 24px;
      transition: margin-left 0.3s ease;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }

    .overlay {
      display: none;
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 899;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 16px;
      }
      .overlay {
        display: block;
      }
    }
  `]
})
export class AppComponent {
  showLayout = false;
  sidebarOpen = false;
  sidebarCollapsed = false;
  isDarkMode = false;

  constructor(private router: Router) {

  // Set the layout correctly as soon as the app starts
  this.showLayout = !this.router.url.startsWith('/login');

  this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe(event => {
      this.showLayout = !event.urlAfterRedirects.startsWith('/login');
      this.sidebarOpen = false;
    });



  this.isDarkMode = localStorage.getItem('darkMode') === 'true';
}

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
  }
}
