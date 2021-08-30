import { inject, injectable } from 'tsyringe'
import { Configuration } from '../entity/configuration.entity'
import { ConfigRepository } from '../repository/config.repository'
import { ConfigService } from './config.service'

@injectable()
export class ConfigServiceImpl implements ConfigService {
  constructor(@inject('ConfigRepository') private configRepository: ConfigRepository) {}

  getConfiguration(): Configuration {
    return this.configRepository.getConfiguration()
  }

  getApiBaseUrl(): string {
    return `${this.configRepository.getConfiguration().HOST}`
  }

  setApiHost(host: string): void {
    this.configRepository.setApiHost(host)
  }
}
