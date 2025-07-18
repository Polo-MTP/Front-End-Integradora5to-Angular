
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError, } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { registerTankData, registerTankResponse } from '../types/tank.types';

@Injectable({
  providedIn: 'root',
})
export class TankService {
  private apiUrl = environment.apiUrl;



  constructor(private http: HttpClient, private router: Router) { }



  registerTank(data: registerTankData): Observable<registerTankResponse> {
    return this.http
      .post<registerTankResponse>(`${this.apiUrl}/tank`, data)
  }

  
}