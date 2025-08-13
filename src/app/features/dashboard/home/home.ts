
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TankService } from '../../../core/services/tank.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SensorCard } from '../../../shared/components/sensor-card/sensor-card';
import {
  Tank,
  TankWithDevices,
  ResponseTanksList,
  Device,
  ResponseTankById
} from '../../../core/types/tank.types';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SensorCard, FormsModule, CardModule, ProgressSpinnerModule, TagModule, SelectModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [NotificationService],
})
export class Home implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  tanks: Tank[] = [];
  selectedTankId: number | null = null;
  selectedTank: TankWithDevices | null = null;
  loading = false;

  constructor(
    private tankService: TankService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTanksList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTanksList(): void {
    this.setLoading(true);
    
    this.tankService.getTanksList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ResponseTanksList) => {
          this.setLoading(false);
          this.handleTanksListResponse(response);
        },
        error: (error) => {
          this.setLoading(false);
          this.notificationService.error('Error al cargar las peceras');
          console.error('Error loading tanks list:', error);
        },
      });
  }

  private handleTanksListResponse(response: ResponseTanksList): void {
    if (response.success && response.data.length > 0) {
      this.tanks = response.data;
      this.selectFirstTank();
    } else {
      this.notificationService.warn('No se encontraron peceras.');
    }
  }

  private selectFirstTank(): void {
    const firstTank = this.tanks[0];
    this.selectedTankId = firstTank.id;
    this.loadTankDetails(firstTank.id);
  }

  loadTankDetails(tankId: number): void {
    if (!tankId) return;

    this.setLoading(true);
    
    this.tankService.getTankById(tankId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.setLoading(false);
          this.handleTankDetailsResponse(response);
        },
        error: (error) => {
          this.setLoading(false);
          this.notificationService.error('Error al cargar los detalles de la pecera');
          console.error('Error loading tank details:', error);
        },
      });
  }

  private handleTankDetailsResponse(response: ResponseTankById): void {
    if (response.success) {
      this.selectedTank = response.data;
      this.selectedTankId = response.data.id;
    } else {
      this.notificationService.warn('No se pudo cargar la pecera.');
    }
  }

  onTankChange(tankId: string | number): void {
    const id = this.parseToNumber(tankId);
    
    if (!this.isValidTankSelection(id)) return;

    this.selectedTankId = id;
    this.loadTankDetails(id);
  }

  private parseToNumber(value: string | number): number {
    return typeof value === 'string' ? parseInt(value, 10) : value;
  }

  private isValidTankSelection(id: number): boolean {
    return !isNaN(id) && 
           id !== this.selectedTankId && 
           this.tanks.some(tank => tank.id === id);
  }

  private setLoading(loading: boolean): void {
    this.loading = loading;
  }

  get sensors(): Device[] {
    return this.selectedTank?.devices ?? [];
  }

  get hasTanks(): boolean {
    return this.tanks.length > 0;
  }

  get hasSelectedTank(): boolean {
    return this.selectedTank !== null;
  }


  trackByTankId(index: number, tank: Tank): number {
    return tank.id;
  }

  trackBySensorId(index: number, sensor: Device): number {
    return sensor.id;
  }

  getFlexBasis(): string {
  const sensorCount = this.sensors.length;
  
  if (sensorCount === 1) return '100%';
  if (sensorCount === 2) return 'calc(50% - 0.75rem)';
  if (sensorCount === 3) return 'calc(33.333% - 0.75rem)';
  return 'calc(25% - 0.75rem)'; 
}
}
