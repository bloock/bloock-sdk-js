enum Network {
  ETHEREUM_MAINNET,
  ETHEREUM_RINKEBY,
  BLOOCK_CHAIN
}

enum CoreNetwork {
  BLOOCKCHAIN = "bloock_chain",
  RINKEBY = "ethereum_rinkeby",
  MAINNET = "ethereum_mainnet"
}

export function selectNetwork(name: String): Network {
  switch (name) {
    case CoreNetwork.BLOOCKCHAIN:
      return Network.BLOOCK_CHAIN

    case CoreNetwork.RINKEBY:
      return Network.ETHEREUM_RINKEBY

    default:
      return Network.ETHEREUM_MAINNET
  }
}

export default Network
