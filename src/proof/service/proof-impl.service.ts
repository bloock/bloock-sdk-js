import { inject, injectable } from 'tsyringe'
import { InvalidMessageException } from '../../message/entity/exception/invalid-message.exception'
import { Message } from '../../message/entity/message.entity'
import { InvalidArgumentException } from '../../shared/entity/exception/invalid-argument.exception'
import { Proof } from '../entity/proof.entity'
import { ProofRepository } from '../repository/proof.repository'
import { ProofService } from './proof.service'

@injectable()
export class ProofServiceImpl implements ProofService {
  constructor(@inject('ProofRepository') private proofRepository: ProofRepository) {}

  async retrieveProof(messages: Message[]): Promise<Proof> {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new InvalidArgumentException()
    }

    if (!messages.every((message) => Message.isValid(message))) {
      throw new InvalidMessageException()
    }

    let sorted = Message.sort(messages)

    return this.proofRepository.retrieveProof(sorted)
  }

  async verifyMessages(messages: Message[]): Promise<number> {
    if (!Array.isArray(messages)) {
      throw new InvalidArgumentException()
    }

    if (!messages.every((message) => Message.isValid(message))) {
      throw new InvalidMessageException()
    }

    let proof = await this.retrieveProof(messages)
    if (proof == null) {
      return Promise.reject("Couldn't get proof for specified messages")
    }

    return this.verifyProof(proof)
  }

  async verifyProof(proof: Proof): Promise<number> {
    try {
      let root = this.proofRepository.verifyProof(proof)
      if (root == null) {
        return Promise.reject('The provided proof is invalid')
      }

      return this.proofRepository.validateRoot(root)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
