import Network from '../../config/entity/networks.entity'
import { Record } from '../../record/entity/record.entity'
import { Proof } from '../entity/proof.entity'

export interface ProofRepository {
  retrieveProof(records: Record[]): Promise<Proof>
  verifyProof(proof: Proof): Record
  validateRoot(network: Network, root: Record): Promise<number>
}
