import { Record } from '../../record/entity/record.entity'
import { Proof } from '../entity/proof.entity'

export interface ProofService {
  retrieveProof(records: Record[]): Promise<Proof>
  verifyRecords(records: Record[]): Promise<number>
  verifyProof(proof: Proof): Promise<number>
}
