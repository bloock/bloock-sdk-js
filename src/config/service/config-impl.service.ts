import { inject, injectable } from 'tsyringe'
import { ConfigEnv } from '../entity/config-env.entity'
import { Configuration } from '../entity/configuration.entity'
import { ConfigRepository } from '../repository/config.repository'
import { ConfigService } from './config.service'

@injectable()
export class ConfigServiceImpl implements ConfigService {
  constructor(@inject('ConfigRepository') private configRepository: ConfigRepository) {}

  setupEnvironment(environment: ConfigEnv): Configuration {
    return this.configRepository.fetchConfiguration(environment)
  }
  getConfiguration(): Configuration {
    return this.configRepository.getConfiguration()
  }

  getApiBaseUrl(): string {
    return `${this.configRepository.getConfiguration().HOST}`
  }
}
