import { TypedArray } from "../shared/utils";

export type Encryption = {
  ciphertext: string,
  iv: string,
  tag: string,
  protect?: string
  encrypted_key?: string
  header?: Headers
}

export type Headers = {
  alg?: string
  [propName: string]: unknown
}

export interface EncryptionClient {
  encrypt(payload: TypedArray, secret: string): Promise<Encryption>
  decrypt(jwe: Encryption, secret: string): Promise<TypedArray>
  generateSecretKey(): Promise<string>
}
