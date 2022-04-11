export type Signature = {
  payload: string
  signatures: {
    signature: string,
    header: Headers
  }[]
}

export type Headers = {
  kty?: string
  crv?: string
  alg?: string
  kid?: string
  [propName: string]: unknown
}

