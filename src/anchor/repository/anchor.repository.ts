import { Anchor } from '../entity/anchor.entity'

export interface AnchorRepository {
  getAnchor(anchor: number): Promise<Anchor>
}
