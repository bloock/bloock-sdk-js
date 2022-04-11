import { Signature } from "../record/entity/document/signature";


export interface SigningClient {
  JWSSign(rawPrivateKey: string, payload: string, headers?: { [name: string]: string }): Promise<Signature>
  JWSVerify(jws: Signature): Promise<void>
}