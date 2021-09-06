import { Configuration, NetworkConfiguration } from '../entity/configuration.entity'
import Network from '../entity/networks.entity'

export interface ConfigRepository {
  getConfiguration(): Configuration
  setApiHost(host: string): void
  getNetworkConfiguration(network: Network): NetworkConfiguration
  setNetworkConfiguration(network: Network, config: NetworkConfiguration): void
}
