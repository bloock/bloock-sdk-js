import { KeyPair, Signature } from "../record/entity/document/signature";


export interface SigningClient {
  JWSSign(rawKeyPair: KeyPair, payload: string, headers?: { [name: string]: string }): Promise<Signature>
}