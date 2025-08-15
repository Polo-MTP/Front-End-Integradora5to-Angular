import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { OnInit } from '@angular/core';
import { TankService } from '../../../core/services/tank.service';
import { ConfigsService } from '../../../core/services/configs.service';
import { ResponseTanksList } from '../../../core/types/tank.types';
import { NotificationService } from '../../../core/services/notification.service';
import { Tank } from '../../../core/types/tank.types';
import { TankWithDevices } from '../../../core/types/tank.types';
import { CardModule } from 'primeng/card';
import { ResponseTankById } from '../../../core/types/tank.types';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Config } from '../../../core/types/config.types';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-configs',
  imports: [
    FormsModule,
    CommonModule,
    DatePicker,
    CardModule,
    ProgressSpinnerModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './configs.html',
  styleUrl: './configs.css',
  providers: [NotificationService],
})
export class Configs implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  date: Date | undefined;
  tanks: Tank[] = [];
  selectedTank: TankWithDevices | null = null;
  minDate: Date = new Date();
  loading = false;
  selectedTankId: number | null = null;
  configs: Config[] = [];

  displayConfigModal: boolean = false;
  selectedDate: Date | null = null;
  configsForSelectedDate: Config[] = [];
  isEditMode: boolean = false;
  currentEditingConfig: Config | null = null;
  showConfigForm: boolean = false;

  newConfig: Partial<Config> = {
    configDay: '',
    configValue: '',
    code: '',
  };

  configTypes = [
    { label: 'Encender', value: 'on' },
    { label: 'Apagar', value: 'off' },
    { label: 'Alimentar', value: 'food' },
  ];

  constructor(
    private tankService: TankService,
    private configsService: ConfigsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadTanksList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTanksList(): void {
    this.setLoading(true);

    this.tankService
      .getTanksList()
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
    this.loadConfigsDtails(firstTank.id);
  }

  loadConfigsDtails(tankId: number): void {
    if (!tankId) return;

    this.setLoading(true);

    this.configsService.getConfigsAll(tankId).subscribe({
      next: (response) => {
        this.setLoading(false);
        if (response.success) {
          this.configs = response.data;
        } else {
          this.notificationService.warn('No se pudo cargar la pecera.');
        }
      },
      error: (error) => {
        this.setLoading(false);
        this.notificationService.error(
          'Error al cargar los detalles de la pecera'
        );
        console.error('Error loading tank details:', error);
      },
    });
  }

  onTankChange(tankId: string | number): void {
    const id = this.parseToNumber(tankId);

    if (!this.isValidTankSelection(id)) return;

    this.selectedTankId = id;
    this.selectedTank = null;
    this.loadConfigsDtails(id);
  }

  private setLoading(loading: boolean): void {
    this.loading = loading;
  }

  private parseToNumber(value: string | number): number {
    return typeof value === 'string' ? parseInt(value, 10) : value;
  }

  trackByTankId(index: number, tank: Tank): number {
    return tank.id;
  }

  get hasTanks(): boolean {
    return this.tanks.length > 0;
  }

  private isValidTankSelection(id: number): boolean {
    return (
      !isNaN(id) &&
      id !== this.selectedTankId &&
      this.tanks.some((tank) => tank.id === id)
    );
  }

  onDateSelect(selectedDate: Date) {
    console.log('Fecha seleccionada:', selectedDate);
    this.selectedDate = selectedDate;
    this.configsForSelectedDate = this.getConfigsForDate(selectedDate);
    this.displayConfigModal = true;
  }

  getConfigsForDate(date: Date): Config[] {
    return this.configs.filter((config) => {
      if (!config.configDay) return false;

      const [year, month, day] = config.configDay.split('-').map(Number);
      const configDate = new Date(year, month - 1, day);

      return (
        configDate.getFullYear() === date.getFullYear() &&
        configDate.getMonth() === date.getMonth() &&
        configDate.getDate() === date.getDate()
      );
    });
  }

  getDateFromDateObject(dateObj: any): Date {
    return new Date(dateObj.year, dateObj.month, dateObj.day);
  }

  getConfigIcon(code: string): { icon: string; class: string } {
    switch (code) {
      case 'on':
        return {
          icon: 'pi pi-lightbulb',
          class: 'bg-yellow-500 text-white',
        };
      case 'off':
        return {
          icon: 'pi pi-lightbulb',
          class: 'bg-gray-500 text-white',
        };
      case 'food':
        return {
          icon: 'pi pi-heart-fill',
          class: 'bg-green-500 text-white',
        };
      default:
        return {
          icon: 'pi pi-circle',
          class: 'bg-blue-500 text-white',
        };
    }
  }

  openAddConfigMode(): void {
    this.isEditMode = false;
    this.currentEditingConfig = null;
    console.log('Selected Date in Add Mode:', this.selectedDate);

    this.newConfig = {
      code: '',
      configDay: this.selectedDate
        ? this.formatDateForAPI(this.selectedDate)
        : '',
      configValue: '',
    };

    this.showConfigForm = true;
  }

  openEditConfigMode(config: Config): void {
    this.isEditMode = true;
    this.currentEditingConfig = config;
    this.showConfigForm = true;
    this.newConfig = { ...config };
  }

  deleteConfig(config: Config): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta configuración?')) {
      this.configsService.deleteConfig(config.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success(
              'Configuración eliminada correctamente'
            );
            this.refreshConfigsAfterChange();
          } else {
            this.notificationService.error(
              'Error al eliminar la configuración'
            );
          }
        },
        error: (error) => {
          this.notificationService.error('Error al eliminar la configuración');
          console.error('Error deleting config:', error);
        },
      });
    }
  }

  saveConfig(): void {
    if (!this.isValidConfig()) {
      this.notificationService.warn(
        'Por favor completa todos los campos requeridos'
      );
      return;
    }

    const getConfigType = (code: string): string => {
      switch (code) {
        case 'on':
          return 'encender luz';
        case 'off':
          return 'apagar luz';
        case 'food':
          return 'comida';
        default:
          return 'desconocido';
      }
    };

    const configData = {
      config_type: getConfigType(this.newConfig.code!),
      config_value: this.newConfig.configValue,
      config_day: this.newConfig.configDay,
      code: this.newConfig.code,
    };

    console.log('Datos a enviar:', configData); // Para debug

    if (this.isEditMode && this.currentEditingConfig) {
      this.configsService
        .updateConfig(this.currentEditingConfig.id!, configData)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success(
                'Configuración actualizada correctamente'
              );
              this.refreshConfigsAfterChange();
              this.closeForm();
            } else {
              this.notificationService.error(
                'Error al actualizar la configuración'
              );
            }
          },
          error: (error) => {
            this.notificationService.error(
              'Error al actualizar la configuración'
            );
            console.error('Error updating config:', error);
          },
        });
    } else {
      this.configsService
        .createConfig(configData, Number(this.selectedTankId))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success(
                'Configuración creada correctamente'
              );
              this.refreshConfigsAfterChange();
              this.closeForm(); // Cambié de resetForm() a closeForm()
            } else {
              this.notificationService.error('Error al crear la configuración');
            }
          },
          error: (error) => {
            this.notificationService.error('Error al crear la configuración');
            console.error('Error creating config:', error);
          },
        });
    }
  }

  private formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  closeModal(): void {
    this.displayConfigModal = false;
    this.closeForm();
  }

  private isValidConfig(): boolean {
    return !!(
      this.newConfig.code &&
      this.newConfig.configDay &&
      this.newConfig.configValue
    );
  }

  resetForm(): void {
    this.newConfig = {
      code: '',
      configDay: '',
      configValue: '',
    };
    this.isEditMode = false;
    this.currentEditingConfig = null;
  }

  closeForm(): void {
    this.resetForm();
    this.showConfigForm = false;
  }

  private refreshConfigsAfterChange(): void {
    if (this.selectedTankId) {
      this.loadConfigsDtails(this.selectedTankId);
      if (this.selectedDate) {
        setTimeout(() => {
          this.configsForSelectedDate = this.getConfigsForDate(
            this.selectedDate!
          );
        }, 100);
      }
    }
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  getModalTitle(): string {
    if (!this.selectedDate) return 'Configuraciones';

    const dateStr = this.selectedDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `Configuraciones del ${dateStr}`;
  }
}
