// ==================== TYPES (tank.types.ts) ====================

// Interfaces para registro de tanques
export interface RegisterTankData {
  name: string;
  description: string;
  devices: DeviceData[];
}

export interface DeviceData {
  sensor_type_id: number;
  quantity: number;
}

export interface RegisterTankResponse {
  success: boolean;
  data: Tank;
  message: string;
}

// Interfaces para dispositivos/sensores
export interface getDevicesResponse {
  message: string;
  data: SensorType[];
}

export interface SensorType {
  id: number;
  name: string;
  code: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedSensor {
  sensor_type_id: number;
  quantity: number;
  sensorType: SensorType;
}

// Interfaces para lista de tanques
export interface ResponseTanksList {
  success: boolean;
  data: Tank[];
}

export interface Tank {
  id: number;
  name: string;
  description: string;
  uuid: string | null;
  isActive: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Interfaces para tanque con sensores
export interface ResponseTankById {
  success: boolean;
  data: TankWithDevices;
}

export interface TankWithDevices {
  id: number;
  name: string;
  description: string;
  uuid: string | null;
  isActive: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  devices: Device[];
}

export interface Device {
  id: number;
  tankId: number;
  sensorTypeId: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  ultimoDato: LastReading;
  sensorType: SensorType;
}

export interface LastReading {
  _id: string;
  id: number;
  id_tank: number;
  sensor: string;
  value: number;
  unit: string;
  date: string;
  device_id: number;
}