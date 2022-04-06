import { Proof } from '../../../proof/entity/proof.entity'
import { TypedArray } from '../../../shared/utils'

export type DocumentLoadArgs = {}

export abstract class Document<T> {
  public ready: Promise<void>
  protected data?: T
  protected payload?: T
  protected signature?: any[]
  protected proof?: Proof

  constructor(src: T, args: DocumentLoadArgs = {}) {
    this.ready = new Promise(async (resolve, reject) => {
      try {
        await this.setup(src)

        this.proof = await this.fetchProof()
        this.signature = await this.fetchSignature()
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
  protected async fetchSignature(): Promise<any[]> {
    return await this.fetchMetadata('signature')
  }
  protected async fetchPayload(): Promise<T> {
    let metadata: { signature?: any[] } = {}
    if (this.signature) {
      metadata.signature = this.signature
    }

    return await this.buildFile(metadata)
  }

  public getData(): T | undefined {
    return this.data
  }
  public getProof(): Proof | undefined {
    return this.proof
  }
  public getSignature(): any[] | undefined {
    return this.signature
  }
  public getPayload(): T | undefined {
    return this.payload
  }
  abstract getPayloadBytes(): TypedArray

  public setProof(proof: Proof): void {
    this.proof = proof
  }

  public setSignature(signature: any[]): void {
    this.signature = signature
  }

  async build(): Promise<T> {
    let metadata: { proof?: Proof; signature?: any[] } = {}

    if (this.proof) {
      metadata.proof = this.proof
    }
    if (this.signature) {
      metadata.signature = this.signature
    }

    return await this.buildFile(metadata)
  }
  protected abstract buildFile(metadata: { [key: string]: any }): Promise<T>
}
