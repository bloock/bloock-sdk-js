import { inject, injectable } from 'tsyringe'
import { Configuration } from '../entity/configuration.entity'
import { ConfigData } from './config-data'
import { ConfigRepository } from './config.repository'

@injectable()
export class ConfigRepositoryImpl implements ConfigRepository {
  constructor(@inject('ConfigData') private configData: ConfigData) {}

  getConfiguration(): Configuration {
    return this.configData.getConfiguration()
  }

  setApiHost(host: string): void {
    this.configData.config.HOST = host
  }
}
