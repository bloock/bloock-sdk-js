import { Signature } from "../record/entity/document/signature";

export interface VerifyingClient {
  JWSVerify(jws: Signature): Promise<void>
}