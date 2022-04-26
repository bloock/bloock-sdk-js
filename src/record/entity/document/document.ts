import { Signature } from '../../../infrastructure/signing.client'
import { Proof } from '../../../proof/entity/proof.entity'
import { TypedArray } from '../../../shared/utils'

export type DocumentLoadArgs = {}

export abstract class Document<T> {
  public ready: Promise<void>
  protected data?: T
  protected payload?: T
  protected signatures?: Signature[]
  protected proof?: Proof

  constructor(src: T, args: DocumentLoadArgs = {}) {
    this.ready = new Promise(async (resolve, reject) => {
      try {
        await this.setup(src)

        this.proof = await this.fetchProof()
        this.signatures = await this.fetchSignatures()
        this.data = await this.fetchData()
        this.payload = await this.fetchPayload()

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  protected abstract setup(src: T): Promise<void>

  protected abstract fetchMetadata(key: string): Promise<any | undefined>
  protected abstract fetchData(): Promise<T | undefined>
  protected async fetchProof(): Promise<Proof> {
    return await this.fetchMetadata('proof')
  }
  protected async fetchSignatures(): Promise<Signature[]> {
    return await this.fetchMetadata('signatures')
  }
  protected async fetchPayload(): Promise<T> {
    let metadata: { signatures?: Signature[] } = {}
    if (this.signatures) {
      metadata.signatures = this.signatures
    }

    return await this.buildFile(metadata)
  }

  public getData(): T | undefined {
    return this.data
  }
  public getProof(): Proof | undefined {
    return this.proof
  }
  public getSignatures(): Signature[] | undefined {
    return this.signatures
  }
  public getPayload(): T | undefined {
    return this.payload
  }
  abstract getDataBytes(): TypedArray
  abstract getPayloadBytes(): TypedArray

  public setProof(proof: Proof): void {
    this.proof = proof
  }

  public addSignature(...signatures: Signature[]): void {
    if (!this.signatures) {
      this.signatures = []
    }

    this.signatures.push(...signatures)
  }

  async build(): Promise<T> {
    let metadata: { proof?: Proof; signatures?: Signature[] } = {}

    if (this.proof) {
      metadata.proof = this.proof
    }
    if (this.signatures) {
      metadata.signatures = this.signatures
    }

    return await this.buildFile(metadata)
  }
  protected abstract buildFile(metadata: { [key: string]: any }): Promise<T>
}
