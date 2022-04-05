import { PDFDict, PDFDocument, PDFName, PDFString } from 'pdf-lib'
import { TypedArray } from '../../../shared/utils'
import { File, FileLoadArgs } from './file'
import { RecordMetadata } from './record-metadata'

type PDFFileLoadArgs = FileLoadArgs & {}

export class PDFFile extends File {
  private document: PDFDocument | undefined

  public constructor(src: string | URL | TypedArray, args: PDFFileLoadArgs = {}) {
    super(src, args)
  }

  async setup(src: TypedArray): Promise<void> {
    this.document = await PDFDocument.load(src, {
      updateMetadata: false,
      throwOnInvalidObject: true,
      ignoreEncryption: true
    })
  }

  protected async fetchMetadata(): Promise<{ [key: string]: string }> {
    if (this.document) {
      let info: PDFDict = this.document['getInfoDict']()
      let metadata: any = {}

      for (let key of info.keys()) {
        let value = info.get(key)
        if (value && value instanceof PDFString) {
          metadata[key.decodeText()] = value.asString()
        }
      }

      return metadata
    }
    return {}
  }

  async addMetadata(key: string, value: any): Promise<void> {
    if (this.document) {
      let info: PDFDict = this.document['getInfoDict']()
      info.set(PDFName.of(key), PDFString.of(value))

      this.metadata = RecordMetadata.fromObject(await this.fetchMetadata())
    }
  }

  protected async removeMetadata(key: string): Promise<void> {
    if (this.document) {
      let info: PDFDict = this.document['getInfoDict']()
      info.delete(PDFName.of(key))
    }
  }

  async buildFile(): Promise<TypedArray> {
    if (this.document) {
      return await this.document.save({ addDefaultPage: false, updateFieldAppearances: false })
    } else {
      return new Uint8Array()
    }
  }
}
