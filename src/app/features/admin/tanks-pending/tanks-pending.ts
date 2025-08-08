import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Tank, TankDetailsResponse } from '../../../core/types/admin.types';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-tanks-pending',
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
    ToastModule,
  ],
  templateUrl: './tanks-pending.html',
  styleUrl: './tanks-pending.css',
  providers: [NotificationService],
})
export class TanksPending implements OnInit {
  loading = false; // Cambiado de true a false inicialmente
  detailsModalVisible: boolean = false;
  aprobarModalVisible: boolean = false;
  loadingDetail: boolean = false;
  TankDetails: TankDetailsResponse | null = null;
  aprobarForm: FormGroup;
  tanksPending: Tank[] = [];
  tankId: number = 0; // Variable para almacenar el ID del tanque seleccionado

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.aprobarForm = this.fb.group({
      uuid: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.loadTanksPending();
  }

  loadTanksPending(event?: any) {
    this.loading = true;

    this.adminService.getTanksPending().subscribe({
      next: (res) => {
        this.tanksPending = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los tanques pendientes'
        );
        this.loading = false;
      },
    });
  }

  aprobarTanqueModal(tank: Tank) {
    this.tankId = tank.id;
    this.aprobarForm.patchValue({
      uuid: tank.uuid
    });
    this.aprobarModalVisible = true;
  }

  closeAprobarModal() {
    this.aprobarModalVisible = false;
    this.aprobarForm.reset();
    this.tankId = 0;
  }

  AprobarTank(tankId: number) {
    if (this.aprobarForm.valid) {
      this.loading = true;

      const formValue = this.aprobarForm.value;
      const updateParams = {
        ...formValue,
        isActive: 1,
      };

      this.adminService.aproveTank(tankId, updateParams).subscribe({
        next: (res) => {
          this.notificationService.success('Tanque Aprobado Correctamente');
          this.loadTanksPending();
          this.closeAprobarModal();
          this.loading = false;
        },
        error: (err) => {
          const error = err.error.message || err.message || 'Error al aprobar el tanque';
          this.notificationService.error(error);
          this.loading = false;
        },
      });
    } else {
      Object.keys(this.aprobarForm.controls).forEach((key) => {
        this.aprobarForm.get(key)?.markAsTouched();
      });
    }
  }

  openDetailsModal(tankId: number) {
    this.TankDetails = null;
    this.loadingDetail = true;
    this.detailsModalVisible = true;

    this.adminService.getDetailsTank(tankId).subscribe({
      next: (res) => {
        this.TankDetails = res;
        this.loadingDetail = false;
      },
      error: (err) => {
        this.notificationService.error('Error', 'No se pudo cargar el detalle');
        console.error(err);
        this.loadingDetail = false;
        this.detailsModalVisible = false;
      },
    });
  }
}