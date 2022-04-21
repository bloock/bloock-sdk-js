import { stringify, stringToBytes, TypedArray } from '../../../shared/utils'
import { Document, DocumentLoadArgs } from './document'

type JSONDocumentLoadArgs = DocumentLoadArgs & {}
export type JSONDocumentContent = { [key: string]: any }

const dataKey = '_data_'
const metadataKey = '_metadata_'

export class JSONDocument extends Document<JSONDocumentContent> {
  private source?: JSONDocumentContent

  public constructor(src: JSONDocumentContent, args: JSONDocumentLoadArgs = {}) {
    super(src, args)
  }

  protected async setup(src: JSONDocumentContent): Promise<void> {
    this.source = src
  }
  protected async fetchMetadata(key: string): Promise<any | undefined> {
    if (this.source) {
      let metadata = this.source[metadataKey]
      if (metadata) {
        return metadata[key]
      }
    }
  }
  protected async fetchData(): Promise<JSONDocumentContent | undefined> {
    if (this.source) {
      if (this.source[dataKey]) {
        return Object.assign({}, this.source[dataKey])
      } else {
        return Object.assign({}, this.source)
      }
    }
  }
  protected async buildFile(metadata: { [key: string]: any }): Promise<JSONDocumentContent> {
    if (Object.keys(metadata).length > 0) {
      let output: JSONDocumentContent = {
        [dataKey]: this.data,
        [metadataKey]: metadata
      }
      return Object.assign({}, output)
    } else {
      return Object.assign({}, this.data) || {}
    }
  }

  public getPayloadBytes(): TypedArray {
    if (this.payload) {
      let jsonString = stringify(this.payload)
      return stringToBytes(jsonString)
    }
    return new Uint8Array()
  }

  public getDataBytes(): TypedArray {
    if (this.data) {
      let jsonString = stringify(this.data)
      return stringToBytes(jsonString)
    }
    return new Uint8Array()
  }
}
