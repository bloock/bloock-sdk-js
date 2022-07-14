import { Network as AnchorNetwork } from '../../anchor/entity/network.entity'

enum Network {
  ETHEREUM_MAINNET,
  ETHEREUM_RINKEBY,
  GNOSIS_CHAIN,
  BLOOCK_CHAIN
}

export enum CoreNetwork {
  BLOOCKCHAIN = 'bloock_chain',
  GNOSIS_CHAIN = 'gnosis_chain',
  RINKEBY = 'ethereum_rinkeby',
  MAINNET = 'ethereum_mainnet'
}

export function selectNetwork(networks: AnchorNetwork[]): Network {
  for (var n of networks) {
    if (n.name == CoreNetwork.MAINNET) {
      return Network.ETHEREUM_MAINNET
    }
  }
  switch (networks[0].name) {
    case CoreNetwork.BLOOCKCHAIN:
      return Network.BLOOCK_CHAIN

    case CoreNetwork.GNOSIS_CHAIN:
      return Network.GNOSIS_CHAIN

    case CoreNetwork.RINKEBY:
      return Network.ETHEREUM_RINKEBY

    default:
      return Network.ETHEREUM_MAINNET
  }
}

export default Network
