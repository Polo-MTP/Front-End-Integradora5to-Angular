import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Tank,
  SensorType,
  SelectedSensor,
  getDevicesResponse,
} from '../../../core/types/tank.types';
import { TankService } from '../../../core/services/tank.service';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';


@Component({
  selector: 'app-mis-peceras',
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    RadioButtonModule,
    TooltipModule,
    ToastModule,
    ReactiveFormsModule,
    FloatLabelModule,
    BadgeModule,
    ProgressSpinnerModule,
    ConfirmDialog
  ],
  templateUrl: './mis-peceras.html',
  styleUrl: './mis-peceras.css',
  providers: [NotificationService, ConfirmationService],
})
export class MisPeceras implements OnInit {
  loading = true;
  tanks: Tank[] = [];

  // Variables para el modal de registro
  showNewTankDialog = false;
  aquariumForm: FormGroup;
  sensorTypes: SensorType[] = [];
  selectedSensorTypes: SelectedSensor[] = [];
  loadingSensorTypes = false;
  sensorTypesError: string = '';
  savingTank = false;
  readonly MAX_SENSORS = 6;

  constructor(
    private tankService: TankService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService
  ) {
    this.aquariumForm = this.formBuilder.group({
      aquariumName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.loadTanks();
  }

  loadTanks() {
    this.loading = true;

    this.tankService.getTanksAll().subscribe({
      next: (res) => {
        this.tanks = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error(
          err.message || 'Error al cargar las peceras'
        );
      },
    });
  }

  deleteTank(event: Event, tankId: number, tankName: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Estás seguro de que quieres eliminar la pecera "${tankName}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.tankService.deleteTank(tankId).subscribe({
          next: () => {
            this.notificationService.success('Pecera eliminada exitosamente');
            this.loadTanks();
          },
          error: (error) => {
            this.notificationService.error(
              error.message || 'Error al eliminar la pecera'
            );
          },
        });
      },
      reject: () => {
        this.notificationService.info('Eliminación cancelada');
      },
    });
  }

  // Métodos para el modal de nueva pecera
  showNewTankModal() {
    this.showNewTankDialog = true;
    this.resetForm();
    this.loadSensorTypes();
  }

  hideNewTankModal() {
    this.showNewTankDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.aquariumForm.reset();
    this.selectedSensorTypes = [];
    this.sensorTypesError = '';
  }

  loadSensorTypes() {
    this.loadingSensorTypes = true;
    this.sensorTypesError = '';

    this.tankService.getDevices().subscribe({
      next: (response: getDevicesResponse) => {
        this.sensorTypes = response.data;
        this.loadingSensorTypes = false;
      },
      error: (error) => {
        this.sensorTypesError = 'Error loading sensor types';
        this.loadingSensorTypes = false;
        this.notificationService.error('Error al cargar los tipos de sensores');
      },
    });
  }

  addSensor(sensorTypeId: number) {
    if (this.getTotalSensors() >= this.MAX_SENSORS) {
      return;
    }

    const existingSensor = this.selectedSensorTypes.find(
      (sensor) => sensor.sensor_type_id === sensorTypeId
    );
    const sensorType = this.sensorTypes.find(
      (sensor) => sensor.id === sensorTypeId
    );

    if (!sensorType) return;

    if (existingSensor) {
      existingSensor.quantity++;
    } else {
      this.selectedSensorTypes.push({
        sensor_type_id: sensorTypeId,
        quantity: 1,
        sensorType: sensorType,
      });
    }
  }

  getTotalSensors(): number {
    return this.selectedSensorTypes.reduce(
      (total, sensor) => total + sensor.quantity,
      0
    );
  }

  removeSensor(sensorTypeId: number) {
    const existingSensor = this.selectedSensorTypes.find(
      (sensor) => sensor.sensor_type_id === sensorTypeId
    );

    if (existingSensor) {
      if (existingSensor.quantity > 1) {
        existingSensor.quantity--;
      } else {
        this.selectedSensorTypes = this.selectedSensorTypes.filter(
          (sensor) => sensor.sensor_type_id !== sensorTypeId
        );
      }
    }
  }

  getSensorType(sensorTypeId: number) {
    return this.sensorTypes.find((sensor) => sensor.id === sensorTypeId);
  }

  getSensorQuantity(sensorTypeId: number): number {
    const sensor = this.selectedSensorTypes.find(
      (s) => s.sensor_type_id === sensorTypeId
    );
    return sensor ? sensor.quantity : 0;
  }

  canAddMoreSensors(): boolean {
    return this.getTotalSensors() < this.MAX_SENSORS;
  }

  hasSensorsSelected(): boolean {
    return this.selectedSensorTypes.length > 0;
  }

  onSubmitAquarium() {
    if (this.aquariumForm.valid && this.hasSensorsSelected()) {
      this.savingTank = true;

      const aquariumData = {
        name: this.aquariumForm.value.aquariumName,
        description: this.aquariumForm.value.description,
        devices: this.selectedSensorTypes.map((sensor) => ({
          sensor_type_id: sensor.sensor_type_id,
          quantity: sensor.quantity,
        })),
      };

      this.tankService.registerTank(aquariumData).subscribe({
        next: () => {
          this.savingTank = false;
          this.hideNewTankModal();
          this.notificationService.success('Pecera registrada exitosamente');
          this.loadTanks();
        },
        error: (error) => {
          this.savingTank = false;
          this.notificationService.error(
            error.message || 'Error al registrar la pecera'
          );
        },
      });
    }
  }
}
