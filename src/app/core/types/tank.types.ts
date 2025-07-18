export interface registerTankData {
    name: string;
    description: string;
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
