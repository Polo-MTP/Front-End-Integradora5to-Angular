export interface SensorResponse {
  message: string
  data: SensorTypes[]
}

export interface SensorTypes {
  id: number
  name: string
  code: string
  isActive: number
  createdAt: string
  updatedAt: string
}
