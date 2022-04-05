import { fetchFile, TypedArray } from '../../../shared/utils'
import { RecordMetadata } from './record-metadata'

export type FileLoadArgs = {
  stripMetadata?: boolean
}

export abstract class File {
  ready: Promise<void>
  content!: TypedArray
  metadata: RecordMetadata | undefined

  constructor(src: string | URL | TypedArray, args: FileLoadArgs = {}) {
    const { stripMetadata = false } = args

    this.ready = new Promise(async (resolve, reject) => {
      try {
        let content: TypedArray
        if (src instanceof URL || typeof src === 'string') {
          content = await fetchFile(src)
        } else {
          content = src
        }

        await this.setup(content)

        this.metadata = RecordMetadata.fromObject(await this.fetchMetadata())
        if (stripMetadata) {
          await this.removeAllMetadata()
        } else {
          await this.removeRecordMetadata()
        }

        this.content = await this.buildFile()

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  protected abstract setup(src: TypedArray): Promise<void>

  protected abstract addMetadata(key: string, value: any): void
  protected abstract fetchMetadata(): Promise<{ [key: string]: string }>
  protected abstract removeMetadata(key: string): Promise<void>

  protected abstract buildFile(): Promise<TypedArray>

  getContent(): TypedArray {
    return this.content
  }

  async addRecordMetadata(metadata: RecordMetadata): Promise<void> {
    let metadataEntries = metadata.entries()
    for (let key of Object.keys(metadataEntries)) {
      this.addMetadata(key, JSON.stringify(metadataEntries[key]))
    }

    this.metadata = RecordMetadata.fromObject(await this.fetchMetadata())
  }

  getRecordMetadata(): RecordMetadata | undefined {
    return this.metadata
  }

  protected async removeAllMetadata(): Promise<void> {
    let metadata = await this.fetchMetadata()
    for (let key of Object.keys(metadata)) {
      this.removeMetadata(key)
    }
  }

  protected async removeRecordMetadata(): Promise<void> {
    let metadata = RecordMetadata.fromObject(await this.fetchMetadata())
    let metadataEntries = metadata.entries()
    for (let key of Object.keys(metadataEntries)) {
      this.removeMetadata(key)
    }
  }

  async getFile(): Promise<TypedArray> {
    if (this.metadata) {
      await this.addRecordMetadata(this.metadata)
    }
    return await this.buildFile()
  }
}
