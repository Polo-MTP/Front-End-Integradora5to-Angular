import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { TankService } from '../../../core/services/tank.service';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import {
  SensorType,
  SelectedSensor,
  getDevicesResponse,
} from '../../../core/types/tank.types';
@Component({
  selector: 'app-register',
  imports: [
    FloatLabelModule,
    CommonModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    RouterModule,
    FileUploadModule,
    StepperModule,
    BadgeModule,
    ChipModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  loginForm: FormGroup;
  aquariumForm: FormGroup;
  loading = false;
  canAccessNextSteps = false;
  error: string = '';
  profileImage: File | null = null;
  currentStep = 1;
  userRegistered = false;
  sensorTypes: SensorType[] = [];
  selectedSensorTypes: SelectedSensor[] = [];
  loadingSensorTypes = false;
  sensorTypesError: string = '';
  readonly MAX_SENSORS = 6;

  constructor(
    private form: FormBuilder,
    private authService: AuthService,
    private tankService: TankService,
    private router: Router
  ) {
    this.loginForm = this.form.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.aquariumForm = this.form.group({
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

    this.loadSensorTypes();
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.profileImage = file;
    }
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

  onSubmitUser() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = new FormData();
      formData.append('fullName', this.loginForm.value.fullName);
      formData.append('email', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);

      if (this.profileImage) {
        formData.append('profileImage', this.profileImage);
      }

      this.authService.register(formData).subscribe({
        next: () => {
          this.loading = false;
          this.userRegistered = true;
          this.canAccessNextSteps = true;
          this.currentStep = 2;
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        },
      });
    }
  }

  onSubmitAquarium() {
    if (this.aquariumForm.valid && this.hasSensorsSelected()) {
      this.loading = true;

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
          this.loading = false;
          this.router.navigate(['/dash/home']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message;
        },
      });
    }
  }


  skipAquarium() {
    this.router.navigate(['/dash/home']);
  }

  goToStep(step: number) {
    this.currentStep = step;
  }
}
