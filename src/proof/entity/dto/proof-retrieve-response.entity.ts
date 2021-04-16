export class ProofRetrieveResponse {
  public leaves: string[]
  public nodes: string[]
  public depth: string
  public bitmap: string
  public root: string

  constructor(data: {
    leaves: string[]
    nodes: string[]
    depth: string
    bitmap: string
    root: string
  }) {
    this.leaves = data.leaves
    this.nodes = data.nodes
    this.depth = data.depth
    this.bitmap = data.bitmap
    this.root = data.root
  }
}
