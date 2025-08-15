import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SensorResponse } from '../types/sensor.types';
import { SensorTypes } from '../types/sensor.types';

@Injectable({
  providedIn: 'root',
})
export class SensorsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSensors(): Observable<SensorResponse> {
    return this.http.get<SensorResponse>(`${this.apiUrl}/admin/sensors`);
  }

  updateSensor(sensor: SensorTypes): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/sensor/${sensor.id}`, sensor);
  }

  createSensor(sensor: SensorTypes): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/sensor`, sensor);
  }

  deleteSensor(sensorId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/sensor/${sensorId}`);
  }
}
