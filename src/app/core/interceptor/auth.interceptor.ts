
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthRoute =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register');

  const token = authService.getToken();

  if (token && !isAuthRoute) {
    req = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/logout')) {
        authService.clearToken();
        router.navigate(['/login']);
      }
      
      if (error.status === 403) {
        const user = authService.getCurrentUser();
        if (user) {
          switch (user.rol) {
            case 'admin':
              router.navigate(['/admin-dashboard']);
              break;
            case 'cliente':
              router.navigate(['/dashboard']);
              break;
            default:
              router.navigate(['/login']);
          }
        } else {
          router.navigate(['/login']);
        }
      }
      
      return throwError(() => error);
    })
  );
};