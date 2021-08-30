import { Configuration } from '../entity/configuration.entity'

export interface ConfigService {
  getConfiguration(): Configuration
  getApiBaseUrl(): string
  setApiHost(host: string): void
}
