import { inject, injectable } from 'tsyringe'
import Web3 from 'web3'
import Network from '../../config/entity/networks.entity'
import { ConfigService } from '../../config/service/config.service'
import { BlockchainClient } from '../blockchain.client'

@injectable()
export class Web3Client implements BlockchainClient {
  private configService: ConfigService

  constructor(@inject('ConfigService') configService: ConfigService) {
    this.configService = configService
  }

  async validateRoot(network: Network, root: string): Promise<number> {
    const config = this.configService.getNetworkConfiguration(network)

    const web3 = new Web3(new Web3.providers.HttpProvider(config.HTTP_PROVIDER))
    const contract = new web3.eth.Contract(JSON.parse(config.CONTRACT_ABI), config.CONTRACT_ADDRESS)

    const timestamp = parseInt(await contract.methods.getState(`0x${root}`).call())
    if (isNaN(timestamp)) {
      return Promise.reject('Returned timestamp is not valid')
    }

    return timestamp
  }
}
