import { TypedArray } from '../shared/utils'

export type Signature = {
  signature: string
  header: Headers
}

export type Headers = {
  kty?: string
  crv?: string
  alg?: string
  kid?: string
  [propName: string]: unknown
}

export interface SigningClient {
  sign(
    payload: TypedArray,
    rawPrivateKey: string,
    headers?: { [name: string]: string }
  ): Promise<Signature>
  verify(payload: TypedArray, ...signatures: Signature[]): Promise<boolean>
}
