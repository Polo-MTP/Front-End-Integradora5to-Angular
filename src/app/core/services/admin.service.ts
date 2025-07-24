import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../types/auth.types';
import { Users } from '../../features/admin/users/users';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(params: any): Observable<{ data: User[]; meta: { total: number } }> {
    return this.http.get<{ data: User[]; meta: { total: number } }>(
      `${this.apiUrl}/admin/index`,
      {
        params,
      }
    );
  }
}
