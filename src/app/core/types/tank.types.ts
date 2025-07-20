export interface registerTankData {
  name: string
  description: string
  devices: DeviceData[]
}

export interface DeviceData {
  sensor_type_id: number
  quantity: number
}

export interface registerTankResponse {
  success: boolean
  data: Tank
  message: string
}

export interface Tank {
  name: string
  description: string
  isActive: boolean
  userId: number
  createdAt: string
  updatedAt: string
  id: number
}

export interface getDevicesResponse {
  message: string
  data: SensorType[]
}

export interface SensorType {
  id: number
  name: string
  code: string
  isActive: number
  createdAt: string
  updatedAt: string
}

export interface SelectedSensor {
  sensor_type_id: number;
  quantity: number;
  sensorType: SensorType; 
}

