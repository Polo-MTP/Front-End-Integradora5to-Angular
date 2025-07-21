import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  success(detail: string, summary: string = 'Exito') {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
    });
  }

  error(error: any, summary: string = 'Error') {
    const errors = error?.error?.errors;

    if (Array.isArray(errors)) {
      for (const err of errors) {
        this.messageService.add({
          severity: 'error',
          summary,
          detail: err.message || 'Error desconocido',
        });
      }
      return;
    }

    const detail =
      error?.error?.message ||
      (typeof error === 'string' ? error : 'Ocurrió un error inesperado');

    this.messageService.add({
      severity: 'error',
      summary,
      detail,
    });
  }

  warn(detail: string, summary: string = 'Advertencia') {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
    });
  }

  info(detail: string, summary: string = 'Información') {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
    });
  }
}
