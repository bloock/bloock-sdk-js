import { Configuration } from '../entity/configuration.entity'

export interface ConfigService {
  getConfiguration(): Configuration
  getApiBaseUrl(): string
  setHost(host: string): void
}
