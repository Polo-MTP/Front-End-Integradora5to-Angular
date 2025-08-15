export interface ConfigsAllResponse {
  success: boolean
  data: Config[]
}

export interface Config {
  id?: number
  tankId?: number | null
  configType?: string
  configDay?: string
  configValue?: string
  code?: string
  createdAt?: string
  updatedAt?: string
}

