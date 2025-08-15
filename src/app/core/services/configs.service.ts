import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfigsAllResponse } from '../types/config.types';
import { Config } from '../types/config.types';

@Injectable({
  providedIn: 'root',
})

export class ConfigsService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getConfigsAll(idTank: number): Observable<ConfigsAllResponse> {
        return this.http.get<ConfigsAllResponse>(`${this.apiUrl}/config/${idTank}`);
    }

    deleteConfig(idConfig: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/config/${idConfig}`);
    }

    updateConfig(idConfig: number, config: Config): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/config/${idConfig}`, config);
    }

    createConfig(config: Config, tankId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/config/${tankId}`, config);
    }
}