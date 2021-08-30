import { Configuration } from '../entity/configuration.entity'

export interface ConfigRepository {
  getConfiguration(): Configuration
  setApiHost(host: string): void
}
