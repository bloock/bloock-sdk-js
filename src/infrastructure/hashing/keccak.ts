import { injectable } from 'tsyringe'
import Web3 from 'web3'
import { bytesToHex, TypedArray } from '../../shared/utils'
import { HashingClient } from '../hashing.client'

@injectable()
export class Keccak implements HashingClient {
  generateHash(data: TypedArray): string {
    let string = bytesToHex(data)
    const hash = Web3.utils.keccak256(`0x${string}`)
    if (!hash) {
      throw "Couldn't hash provided value (Keccak256)"
    }
    return hash.slice(2)
  }
}
