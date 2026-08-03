import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn$.value) {
    const requiredRole = route.data['role'] as string;
    if (requiredRole) {
      if (requiredRole === 'admin' && authService.isAdmin()) return true;
      if (requiredRole === 'manager' && authService.isManager()) return true;
      if (requiredRole === 'employee') return true;
    } else {
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn$.value) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
