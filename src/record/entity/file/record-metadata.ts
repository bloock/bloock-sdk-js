import { Proof } from '../../../proof/entity/proof.entity'

export class RecordMetadata {
  signature?: any[]
  proof?: Proof

  static fromObject(obj: { [key: string]: string }): RecordMetadata {
    let metadata = {
      signature: undefined,
      proof: undefined
    }
    try {
      if (obj['signature']) {
        metadata.signature = JSON.parse(obj['signature'])
      }
    } catch (_) {}

    try {
      if (obj['proof']) {
        metadata.proof = JSON.parse(obj['proof'])
      }
    } catch (_) {}

    return new RecordMetadata(metadata)
  }

  constructor(values: { signature?: any[]; proof?: Proof }) {
    this.signature = values.signature
    this.proof = values.proof
  }

  entries(): any {
    return {
      signature: this.signature,
      proof: this.proof
    }
  }

  isEmpty(): boolean {
    if (this.signature || this.proof) {
      return false
    }
    return true
  }
}
