
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  RegisterTankData,
  RegisterTankResponse,
  getDevicesResponse,
  ResponseTanksList,
  ResponseTankById
} from '../types/tank.types';

@Injectable({
  providedIn: 'root',
})
export class TankService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registerTank(data: RegisterTankData): Observable<RegisterTankResponse> {
    return this.http.post<RegisterTankResponse>(`${this.apiUrl}/tanks`, data);
  }

  deleteTank(tankId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tanks/${tankId}`);
  }

  getDevices(): Observable<getDevicesResponse> {
    return this.http.get<getDevicesResponse>(`${this.apiUrl}/sensor-types`);
  }

  getTanksList(): Observable<ResponseTanksList> {
    return this.http.get<ResponseTanksList>(`${this.apiUrl}/tanks`);
  }

  getTanksAll(): Observable<ResponseTanksList> {
    return this.http.get<ResponseTanksList>(`${this.apiUrl}/tanks/all`);
  }

  getTankById(id: number): Observable<ResponseTankById> {
    return this.http.get<ResponseTankById>(`${this.apiUrl}/tanks/${id}/data`);
  }
}