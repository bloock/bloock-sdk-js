import { PDFDict, PDFDocument as PDFLib, PDFName, PDFString } from 'pdf-lib'
import { stringify, TypedArray } from '../../../shared/utils'
import { Document, DocumentLoadArgs } from './document'

type PDFDocumentLoadArgs = DocumentLoadArgs & {}

export class PDFDocument extends Document<TypedArray> {
  private source?: PDFLib

  public constructor(src: TypedArray, args: PDFDocumentLoadArgs = {}) {
    super(src, args)
  }

  protected async setup(src: TypedArray): Promise<void> {
    this.source = await PDFLib.load(src, {
      updateMetadata: false,
      throwOnInvalidObject: true,
      ignoreEncryption: true
    })
  }
  protected async fetchMetadata(key: string): Promise<any | undefined> {
    if (this.source) {
      let info: PDFDict = this.source['getInfoDict']()
      let value = info.get(PDFName.of(key))

      if (value && value instanceof PDFString) {
        try {
          return JSON.parse(value.asString())
        } catch (err) {
          return value.asString()
        }
      }
    }
  }
  protected async fetchData(): Promise<TypedArray | undefined> {
    if (this.source) {
      let clone = Object.assign(Object.create(Object.getPrototypeOf(this.source)), this.source)
      let info: PDFDict = clone['getInfoDict']()
      info.delete(PDFName.of('proof'))
      info.delete(PDFName.of('signatures'))

      return await this.write(clone)
    }
  }
  protected async buildFile(metadata: { [key: string]: any }): Promise<TypedArray> {
    if (this.source) {
      let clone = Object.assign(Object.create(Object.getPrototypeOf(this.source)), this.source)

      let info: PDFDict = clone['getInfoDict']()
      for (let key in metadata) {
        info.set(PDFName.of(key), PDFString.of(stringify(metadata[key])))
      }

      return await this.write(clone)
    }

    return new Uint8Array()
  }

  public getPayloadBytes(): TypedArray {
    if (this.payload) {
      return this.payload
    }
    return new Uint8Array()
  }

  public getDataBytes(): TypedArray {
    if (this.data) {
      return this.data
    }
    return new Uint8Array()
  }

  private async write(document: PDFLib): Promise<TypedArray> {
    return await document.save({ addDefaultPage: false, updateFieldAppearances: false })
  }
}
