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

export class KeyPair {
  privateKey: string
  publicKey: string

  constructor(privateKey: string, publicKey: string) {
    this.privateKey = privateKey,
      this.publicKey = publicKey
  }
}

