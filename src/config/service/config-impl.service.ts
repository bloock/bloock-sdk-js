import { inject, injectable } from 'tsyringe'
import { Configuration, NetworkConfiguration } from '../entity/configuration.entity'
import Network from '../entity/networks.entity'
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

  getNetworkConfiguration(network: Network): NetworkConfiguration {
    return this.configRepository.getNetworkConfiguration(network)
  }

  setNetworkConfiguration(network: Network, config: NetworkConfiguration): void {
    return this.configRepository.setNetworkConfiguration(network, config)
  }
}
