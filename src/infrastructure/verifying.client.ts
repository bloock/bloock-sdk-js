import { Signature } from "../record/entity/document/signature/signature";

export interface VerifyingClient {
  JWSVerify(jws: Signature): Promise<void>
}