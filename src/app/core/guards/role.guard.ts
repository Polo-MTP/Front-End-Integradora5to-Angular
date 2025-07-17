import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const RoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const user = authService.getCurrentUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(user.rol)) {
      return true;
    }

    switch (user.rol) {
      case 'admin':
        router.navigate(['/admin-dashboard']);
        break;
      case 'cliente':
        router.navigate(['/dashboard']);
        break;
      default:
        router.navigate(['/']);
    }
    
    return false;
  };
};