import { Configuration } from '../entity/configuration.entity'

export interface ConfigRepository {
  getConfiguration(): Configuration
  setHost(host: string): void
}
