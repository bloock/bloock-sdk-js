import { inject, injectable } from 'tsyringe'
import { Configuration, NetworkConfiguration } from '../entity/configuration.entity'
import Network from '../entity/networks.entity'
import { ConfigData } from './config-data'
import { ConfigRepository } from './config.repository'

@injectable()
export class ConfigRepositoryImpl implements ConfigRepository {
  constructor(@inject('ConfigData') private configData: ConfigData) {}

  getConfiguration(): Configuration {
    return this.configData.getConfiguration()
  }

  getNetworkConfiguration(network: Network): NetworkConfiguration {
    return this.configData.getNetworkConfiguration(network)
  }

  setNetworkConfiguration(network: Network, config: NetworkConfiguration): void {
    return this.configData.setNetworkConfiguration(network, config)
  }

  setApiHost(host: string): void {
    this.configData.config.HOST = host
  }
}
