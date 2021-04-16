import { Anchor } from '../entity/anchor.entity'

export interface AnchorService {
  getAnchor(anchorId: number): Promise<Anchor>
  waitAnchor(anchorId: number, timeout?: number): Promise<Anchor>
}
