import { inject, injectable } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { BlockchainClient } from '../../infrastructure/blockchain.client'
import { HttpClient } from '../../infrastructure/http.client'
import { Message } from '../../message/entity/message.entity'
import { Utils } from '../../shared/utils'
import { ProofRetrieveRequest } from '../entity/dto/proof-retrieve-request.entity'
import { Proof } from '../entity/proof.entity'
import { ProofRepository } from './proof.repository'

@injectable()
export class ProofRepositoryImpl implements ProofRepository {
  constructor(
    @inject('HttpClient') private httpClient: HttpClient,
    @inject('BlockchainClient') private blockchainClient: BlockchainClient,
    @inject('ConfigService') private configService: ConfigService
  ) {}

  retrieveProof(messages: Message[]): Promise<Proof> {
    let url = `${this.configService.getApiBaseUrl()}/core/proof`
    let body = new ProofRetrieveRequest(messages.map((messages) => messages.getHash()))
    return this.httpClient.post(url, body)
  }

  verifyProof(proof: Proof): Message {
    const leaves = proof.leaves.map((leaf) => Message.fromHash(leaf).getUint8ArrayHash())
    const hashes = proof.nodes.map((node) => Utils.hexToBytes(node))
    const depth = Utils.hexToUint16(proof.depth)
    const bitmap = Utils.hexToBytes(proof.bitmap)

    let it_leaves = 0
    let it_hashes = 0
    const stack: [Uint8Array, number][] = []

    while (it_hashes < hashes.length || it_leaves < leaves.length) {
      let act_depth = depth[it_hashes + it_leaves]
      let act_hash: Uint8Array

      if (
        (bitmap[Math.floor((it_hashes + it_leaves) / 8)] &
          (1 << (7 - ((it_hashes + it_leaves) % 8)))) >
        0
      ) {
        act_hash = hashes[it_hashes]
        it_hashes += 1
      } else {
        act_hash = leaves[it_leaves]
        it_leaves += 1
      }
      while (stack.length > 0 && stack[stack.length - 1][1] == act_depth) {
        const last_hash = stack.pop()
        if (!last_hash) {
          throw new Error('Verify: Stack got empty before capturing its value.')
        }
        act_hash = Utils.merge(last_hash[0], act_hash)
        act_depth -= 1
      }
      stack.push([act_hash, act_depth])
    }
    return Message.fromHash(Utils.bytesToHex(stack[0][0]))
  }

  validateRoot(root: Message): Promise<number> {
    return this.blockchainClient.validateRoot(root.getHash())
  }
}
