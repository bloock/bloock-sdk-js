import Network from '../config/entity/networks.entity'

export interface BlockchainClient {
  validateRoot(network: Network, root: string): Promise<number>
}
