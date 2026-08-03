import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCardModule, MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',

})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.snackBar.open('Please enter email and password', 'OK', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe(result => {
      this.loading = false;
      if (result.success && result.user) {

switch (result.user.role) {

  case 'employee':
    this.router.navigate(['/employee-dashboard']);
    break;

  case 'manager':
  this.router.navigate(['/manager-dashboard']);
  break;

  case 'hr':
    this.router.navigate(['/dashboard']);
    break;

  default:
    this.router.navigate(['/dashboard']);
}
      } else {
        this.snackBar.open(result.error || 'Login failed', 'OK', { duration: 3000 });
      }
    });
  }

  quickLogin(email: string): void {
    this.email = email;
    this.password = '123456';
    this.login();
  }
}
