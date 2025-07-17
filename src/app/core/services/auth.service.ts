// Mejoras para auth.service.ts

import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  User,
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  ApiErrorResponse,
  ValidationError,
} from '../types/auth.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private token_key = 'auth_token';
  private user_key = 'auth_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getCurrentUser()
  );

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  register(formData: FormData): Observable<LoginResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/auth/register`, formData)
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
          this.redirectAfterAuth();
        }),
        catchError(this.handleError.bind(this))
      );
  }

  login(userData: LoginData): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, userData)
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
          this.redirectAfterAuth();
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap({
          next: () => {
            this.handleLogout();
          },
          error: () => {
            this.handleLogout();
          },
        }),
        catchError((error) => {
          this.handleLogout();
          return of({ message: 'Logout Completed' });
        })
      );
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/refresh`, {})
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
        }),
        catchError((error) => {
          this.handleLogout();
          return throwError(error);
        })
      );
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }
    return this.http
      .get(`${this.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(true);
        }),
        map(() => true),
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            this.clearUserData();
          }
          return of(false);
        })
      );
  }

  private redirectAfterAuth(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;

    if (returnUrl) {
      this.router.navigate([returnUrl]);
    } else {
      const user = this.getCurrentUser();
      if (user) {
        this.redirectByRole(user.rol);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  private redirectByRole(rol: string): void {
    switch (rol) {
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'cliente':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  isCliente(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'cliente';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'admin';
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.rol) : false;
  }

  hasSpecificRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  private handleAuthResponse(response: LoginResponse): void {
    localStorage.setItem(this.token_key, response.token);
    localStorage.setItem(this.user_key, JSON.stringify(response.user));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(response.user);
  }

  private handleLogout(): void {
    this.clearUserData();
    this.router.navigate(['/login']);
  }

  private clearUserData(): void {
    localStorage.removeItem(this.user_key);
    localStorage.removeItem(this.token_key);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorResponse: ApiErrorResponse = {
      message: 'Ha ocurrido un error al procesar la petición',
      errors: [],
    };

    if (error.error instanceof ErrorEvent) {
      errorResponse.message = error.error.message;
    } else {
      if (error.error && typeof error.error === 'object') {
        errorResponse = {
          message: error.error.message || 'Error al procesar la petición',
          errors: error.error.errors || [],
        };
      } else {
        errorResponse.message = error.message;
      }
    }
    return throwError(() => errorResponse);
  }

  initAuthService(): void {
    const token = this.getToken();
    if (token) {
      this.validateTokenWithAPI(token);
    }
  }

  private validateTokenWithAPI(token: string) {
    this.http
      .get(`${this.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          this.isAuthenticatedSubject.next(true);
        },
        error: (error) => {
          if (error.status === 401 || error.status === 403) {
            this.isAuthenticatedSubject.next(false);
            this.clearUserData();
          }
        },
      });
  }

  getToken(): string {
    return localStorage.getItem(this.token_key) || '';
  }

  private hasToken(): boolean {
    const token = this.getToken();
    return !!token && token.trim().length > 0;
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.user_key);
    return userJson ? JSON.parse(userJson) : null;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  clearToken(): void {
    localStorage.removeItem(this.token_key);
    this.isAuthenticatedSubject.next(false);
  }

  clearUser(): void {
    localStorage.removeItem(this.user_key);
    this.currentUserSubject.next(null);
  }

  getCurrentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  updateUserInfo(user: User): void {
    localStorage.setItem(this.user_key, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch {
      return true;
    }
  }
}
