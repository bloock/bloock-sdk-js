import { inject, injectable } from 'tsyringe'
import Network, { selectNetwork } from '../../config/entity/networks.entity'
import { InvalidRecordException } from '../../record/entity/exception/invalid-record.exception'
import { Record } from '../../record/entity/record.entity'
import { InvalidArgumentException } from '../../shared/entity/exception/invalid-argument.exception'
import { Proof } from '../entity/proof.entity'
import { ProofRepository } from '../repository/proof.repository'
import { ProofService } from './proof.service'

@injectable()
export class ProofServiceImpl implements ProofService {
  constructor(@inject('ProofRepository') private proofRepository: ProofRepository) {}

  async retrieveProof(records: Record[]): Promise<Proof> {
    if (!Array.isArray(records) || records.length === 0) {
      throw new InvalidArgumentException()
    }

    if (!records.every((record) => Record.isValid(record))) {
      throw new InvalidRecordException()
    }

    let sorted = Record.sort(records)

    return this.proofRepository.retrieveProof(sorted)
  }

  async verifyRecords(records: Record[], network?: Network): Promise<number> {
    if (!Array.isArray(records)) {
      throw new InvalidArgumentException()
    }

    if (!records.every((record) => Record.isValid(record))) {
      throw new InvalidRecordException()
    }

    let proof = await this.retrieveProof(records)
    if (proof == null) {
      return Promise.reject("Couldn't get proof for specified records")
    }

    let finalNetwork: Network
    if (network) {
      finalNetwork = network
    } else {
      finalNetwork = selectNetwork(proof.anchor.networks)
    }

    let root = await this.verifyProof(proof)
    return this.validateRoot(root, finalNetwork)
  }

  async verifyProof(proof: Proof): Promise<Record> {
    try {
      let root = this.proofRepository.verifyProof(proof)
      if (root == null) {
        return Promise.reject('The provided proof is invalid')
      }

      return root
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async validateRoot(root: Record, network: Network): Promise<number> {
    try {
      if (root == null) {
        return Promise.reject('The provided root is invalid')
      }

      return this.proofRepository.validateRoot(network, root)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
