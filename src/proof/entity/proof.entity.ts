import { isHex } from '../../shared/utils'
import { Anchor } from '../../anchor/entity/anchor.entity'
import { Utils } from '../../shared/utils'

/**
 * Proof is the object in charge of storing all data necessary to compute
 * a data integrity check.
 */
export class Proof {
  public leaves: string[]
  public nodes: string[]
  public depth: string
  public bitmap: string
  public anchor: Anchor

  constructor(leaves: string[], nodes: string[], depth: string, bitmap: string, anchor: Anchor) {
    this.leaves = leaves
    this.nodes = nodes
    this.depth = depth
    this.bitmap = bitmap
    this.anchor = anchor
  }

  /**
   * Checks whether the Proof was build with valid parameters or not.
   * @param  {Proof} proof Proof to validate.
   * @returns {boolean} A Boolean that returns True if the proof is valid, False if not.
   */
  public static isValid(proof: Proof): boolean {
    if (proof instanceof Proof) {
      try {
        if (proof.leaves.some((l) => !isHex(l) || l.length != 64)) {
          return false
        }

        if (proof.nodes.some((n) => !isHex(n) || n.length != 64)) {
          return false
        }

        if (
          proof.depth.length != (proof.leaves.length + proof.nodes.length) * 4 &&
          isHex(proof.depth)
        ) {
          return false
        }

        let nElements = proof.leaves.length + proof.nodes.length
        if (proof.depth.length != nElements * 4) {
          return false
        }
        if (
          Math.floor(proof.bitmap.length / 2) < Math.floor((nElements + 8 - (nElements % 8)) / 8)
        ) {
          return false
        }
        return true
      } catch (e) {
        return false
      }
    }

    return false
  }
}
