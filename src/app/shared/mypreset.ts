import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  primitive: {
    indigo: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    }, 
    zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  }
  },
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    secondary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{blue.600}',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}',
          inverseColor: '#ffffff',
        },
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
          1000: '{zinc.500}',
        },
        FormField: {
          color: '#000000',
          filledBackground: '#ffffff',
          filledHoverBackground: '#ffffff',
          filledFocusBackground: '#ffffff',
        }
      },
      dark: {
        primary: {
          color: '{blue.500}',
          hoverColor: '{blue.600}',
          activeColor: '{blue.200}',
          inverseColor: '#000000',
        },
        secondary: {
          color: '{zinc.900}',
          hoverColor: '{zinc.300}',
          activeColor: '{zinc.200}',
          inverseColor: '#000000',
        },
        surface: {
          0: '#ffffff',
          50: '{slate.100}',
          100: '{zinc.100}', //color textos
          200: '{blue.600}', //color titulos secciones
          300: '{red.500}',
          400: '{zinc.100}',
          500: '{blue.950}',
          600: '{blue.600}',
          700: '{zinc.600}', // color de las secciones
          800: '{zinc.600}', //color cuando h¿aces hover elemento y secciones
          900: '{zinc.900}', //color de los fondos
          950: '{zinc.900}',// color de los inputs tambien
          1000: '{zinc.500}',
        },
        formField: {
          color: 'zinc.50',
          filledBackground: '#ffffff',           // fondo cuando está lleno
          filledHoverBackground: '#ffffff',
          filledFocusBackground: '#ffffff',
          borderColor: '{zinc.500}',
        }
      }
    }
  }
});

export default MyPreset;