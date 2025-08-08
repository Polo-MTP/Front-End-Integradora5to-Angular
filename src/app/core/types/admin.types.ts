export interface UserIndex {
    id: number;
    fullName: string;
    email: string;
    rol: string;
    profileImage: string | null;
}

export interface TankPendingResponse {
  message: string
  data: Tank[]
}

export interface Tank {
  id: number
  name: string
  description: string
  uuid?: string
  isActive: number
  userId: number
  createdAt: string
  updatedAt: string
}


export interface TankDetailsResponse {
  message: string
  tank: Tank
  devices: Device[]
  user: User
}


export interface Device {
  id: number
  tankId: number
  sensorTypeId: number
  name: string
  code: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  fullName: string
  email: string
  rol: string
  profileImage: string | null
  profileImageId: any
  createdAt: string
  updatedAt: string
}

export interface aproveTankResponse {
  message: string
}


