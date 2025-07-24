// guest.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const GuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const user = authService.getCurrentUser();
  if (user) {
    switch (user.rol) {
      case 'admin':
        router.navigate(['/admin/home']);
        break;
      case 'cliente':
        router.navigate(['/dash/home']);
        break;
      default:
        router.navigate(['/']);
    }
  } else {
    router.navigate(['/']);
  }
  
  return false;
};