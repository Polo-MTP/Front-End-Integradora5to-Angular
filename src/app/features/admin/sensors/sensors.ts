import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SensorsService } from '../../../core/services/sensors.service';
import { SensorTypes } from '../../../core/types/sensor.types';
import { NotificationService } from '../../../core/services/notification.service';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-sensors',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    TableModule, 
    CardModule, 
    ButtonModule,
    DialogModule,
    InputTextModule,
    RadioButtonModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './sensors.html',
  styleUrl: './sensors.css',
  providers: [NotificationService]
})
export class Sensors implements OnInit {
  sensors: SensorTypes[] = [];
  loading = true;

  editModalVisible: boolean = false;
  createModalVisible: boolean = false;
  createSensorForm: FormGroup;
  editSensorForm: FormGroup;
  saving: boolean = false;

  constructor(
    private sensorsService: SensorsService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.editSensorForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(1)]],
      isActive: ['1', Validators.required]
    });

    this.createSensorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(1)]],
      isActive: ['1', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSensors();
  }

  loadSensors() {
    this.loading = true;

    this.sensorsService.getSensors().subscribe({
      next: (res) => {
        this.sensors = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  editSensor(sensor: SensorTypes) {
    this.editSensorForm.patchValue({
      id: sensor.id,
      name: sensor.name,
      code: sensor.code,
      isActive: sensor.isActive.toString() 
    });
    
    this.editModalVisible = true;
  }

  createSensorModal() {
    this.createModalVisible = true;
  }

  closeCreateModal() {
    this.createModalVisible = false;
    this.createSensorForm.reset();
  }

  closeEditModal() {
    this.editModalVisible = false;
    this.editSensorForm.reset();
  }

  creteSensor() {
    if (this.createSensorForm.valid) {
      this.saving = true;
      
      const formValue = this.createSensorForm.value;
      const newSensor = {
        ...formValue,
        isActive: Number(formValue.isActive) 
      };
      
      this.sensorsService.createSensor(newSensor).subscribe({
        next: (res) => {
          this.notificationService.success('Sensor creado correctamente');
          this.loadSensors();
          this.saving = false;
          this.closeCreateModal();
        },
        error: (err) => {
          console.error('Error al crear sensor:', err);
          this.saving = false;
        }
      });
    } else {
      Object.keys(this.createSensorForm.controls).forEach(key => {
        this.createSensorForm.get(key)?.markAsTouched();
      });
    }
  }

  saveSensor() {
    if (this.editSensorForm.valid) {
      this.saving = true;
      
      const formValue = this.editSensorForm.value;
      const updatedSensor = {
        ...formValue,
        isActive: Number(formValue.isActive) 
      };
      
      this.sensorsService.updateSensor(updatedSensor).subscribe({
        next: (res) => {
          this.notificationService.success('Sensor actualizado correctamente');
          this.loadSensors();
          this.saving = false;
          this.closeEditModal();
          
        },
        error: (err) => {
          this.notificationService.error(err);
          this.saving = false;
        }
      });
    } else {
      Object.keys(this.editSensorForm.controls).forEach(key => {
        this.editSensorForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteSensor(sensorId: number) {
    if (confirm('¿Está seguro de que desea eliminar este sensor?')) {
      this.sensorsService.deleteSensor(sensorId).subscribe({
        next: (res) => {
          this.loadSensors(); 
        },
        error: (err) => {
          console.error('Error al eliminar sensor:', err);
        }
      });
    }
  }
}