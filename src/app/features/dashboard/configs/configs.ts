import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-configs',
  imports: [FormsModule, CommonModule, DatePicker],
  templateUrl: './configs.html',
  styleUrl: './configs.css',
})
export class Configs implements OnInit {
  date: Date | undefined;
  minDate: Date = new Date();
  es: any;

  configurations = [
    {
      id: 11,
      configType: 'comida',
      configDay: '2024-12-20T06:00:00.000Z',
      configValue: '10:44',
      code: 'on', // foco prendido
      tankId: 2,
    },
    {
      id: 12,
      configType: 'comida',
      configDay: '2025-08-13T06:00:00.000Z',
      configValue: '10:44',
      code: 'food', // comida
      tankId: 2,
    },
    {
      id: 13,
      configType: 'luz',
      configDay: '2025-08-13T06:00:00.000Z',
      configValue: '18:00',
      code: 'off',
      tankId: 1,
    },
    {
      id: 14,
      configType: 'luz',
      configDay: '2025-08-14T06:00:00.000Z',
      configValue: '18:00',
      code: 'on',
      tankId: 1,
    },
    {
      id: 15,
      configType: 'luz',
      configDay: '2025-08-15T06:00:00.000Z',
      configValue: '18:00',
      code: 'off',
      tankId: 2,
    },
  ];

  ngOnInit() {
  }

  onDateSelect(selectedDate: Date) {
    console.log('Fecha seleccionada:', selectedDate);
    console.log(
      'Configuraciones para la fecha:',
      this.getConfigsForDate(selectedDate)
    );
  }

  getConfigsForDate(date: Date): any[] {
    return this.configurations.filter((config) => {
      const configDate = new Date(config.configDay);
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
}
