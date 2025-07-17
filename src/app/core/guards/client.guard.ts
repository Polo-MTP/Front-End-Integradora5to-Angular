import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const ClientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.isCliente()) {
    return true;
  }

  const user = authService.getCurrentUser();
  if (user?.rol === 'admin') {
    router.navigate(['/admin-dashboard']);
  } else {
    router.navigate(['/']);
  }

  return false;
};