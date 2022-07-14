import { Network } from '../network.entity'

export class AnchorRetrieveResponse {
  public id: number
  public block_roots: string[]
  public networks: Network[]
  public root: string
  public status: string

  constructor(data: {
    id: number
    block_roots: string[]
    networks: { name: string; state: string; txHash: string }[]
    root: string
    status: string
  }) {
    this.id = data.id
    this.block_roots = data.block_roots
    this.networks = data.networks.map(
      (network) => new Network(network.name, network.state, network.txHash)
    )
    this.root = data.root
    this.status = data.status
  }
}
