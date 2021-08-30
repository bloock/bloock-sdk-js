import { Record } from '../../record/entity/record.entity'
import { Proof } from '../entity/proof.entity'

export interface ProofRepository {
  retrieveProof(records: Record[]): Promise<Proof>
  verifyProof(proof: Proof): Record
  validateRoot(root: Record): Promise<number>
}
