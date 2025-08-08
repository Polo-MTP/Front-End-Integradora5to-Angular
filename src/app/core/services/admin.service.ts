import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../types/auth.types';
import { TankPendingResponse } from '../types/admin.types';
import { TankDetailsResponse } from '../types/admin.types';
import { aproveTankResponse } from '../types/admin.types';

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

  aproveTank(tankId: number, params: any): Observable<aproveTankResponse> {
    return this.http.put<aproveTankResponse>(
      `${this.apiUrl}/admin/tank/aprove/${tankId}`,
      params
    );
  }

  getDetailsTank(id: number): Observable<TankDetailsResponse> {
    return this.http.get<TankDetailsResponse>(
      `${this.apiUrl}/admin/tank/details/${id}`
    );
  }

  getTanksPending(): Observable<TankPendingResponse> {
    return this.http.get<TankPendingResponse>(`${this.apiUrl}/admin/tanks`);
  }
}
