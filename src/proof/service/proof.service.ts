import Network from '../../config/entity/networks.entity'
import { Record } from '../../record/entity/record.entity'
import { Proof } from '../entity/proof.entity'

export interface ProofService {
  retrieveProof(records: Record[]): Promise<Proof>
  verifyRecords(records: Record[], network: Network): Promise<number>
  verifyProof(proof: Proof, network: Network): Promise<number>
}
