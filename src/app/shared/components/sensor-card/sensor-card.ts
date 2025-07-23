import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-sensor-card',
  imports: [CommonModule, CardModule, ProgressBarModule],
  templateUrl: './sensor-card.html',
  standalone: true,
  styleUrl: './sensor-card.css'
})
export class SensorCard {
  @Input() sensor : any;

  get Value(): any {
    return this.sensor?.ultimoDato?.value ?? 0;
  }

  get Name(): any {
    return this.sensor?.name ?? '';
  }

  get Type(): any {
    return this.sensor?.sensorType?.code ?? 'default';
  }

getTemperatureStatus(value: number): string {
  if (value >= 24 && value <= 26) return 'Óptimo';
  if ((value >= 22 && value < 24) || (value > 26 && value <= 28)) return 'Aceptable';
  if (value < 22) return 'Muy Frío';
  return 'Muy Caliente';
}

getTemperaturePercentage(value: number): number {
  const min = 20;
  const max = 30;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

getTemperatureBarClass(value: number): string {
  if (value >= 24 && value <= 26) return 'bg-green-100';
  if ((value >= 22 && value < 24) || (value > 26 && value <= 28)) return 'bg-yellow-100';
  return 'bg-red-100';
}

getHumidityStatus(value: number): string {
  if (value >= 60 && value <= 70) return 'Óptimo';
  if ((value >= 50 && value < 60) || (value > 70 && value <= 80)) return 'Aceptable';
  if (value < 50) return 'Muy Seco';
  return 'Muy Húmedo';
}

getHumidityBarClass(value: number): string {
  if (value >= 60 && value <= 70) return 'bg-green-100';
  if ((value >= 50 && value < 60) || (value > 70 && value <= 80)) return 'bg-yellow-100';
  return 'bg-red-100';
}

getPHStatus(value: number): string {
  if (value >= 6.5 && value <= 7.5) return 'Neutro - Óptimo';
  if (value < 6.5) return 'Ácido';
  return 'Básico';
}

getPHPosition(value: number): number {
  return Math.min(100, Math.max(0, (value / 14) * 100));
}
}
