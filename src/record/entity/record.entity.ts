import { HashingClient } from '../../infrastructure/hashing.client'
import { Keccak } from '../../infrastructure/hashing/keccak'
import { SigningClient } from '../../infrastructure/signing.client'
import { JWSClient } from '../../infrastructure/signing/jws'
import { Proof } from '../../proof/entity/proof.entity'
import { hexToBytes, isHex, stringify, stringToBytes, TypedArray } from '../../shared/utils'
import { Document } from './document/document'
import { JSONDocument, JSONDocumentContent } from './document/json'
import { PDFDocument } from './document/pdf'
import { InvalidRecordTypeException } from './exception/invalid-record-type.exception'
import { NoSignatureFoundExceptin } from './exception/no-signature-exception'

/**
 * Record is the class in charge of computing and storing the
 * value of the data sent to Bloock.
 * This class is intended to be used by calling "from" static
 * methods to create instances of Record.
 */
export class Record<T = any> {
  private static hashAlgorithm: HashingClient = new Keccak()
  private signing: SigningClient = new JWSClient()

  private hash: string
  private document?: Document<T>

  private constructor(hash: string, document?: Document<T>) {
    this.hash = hash
    this.document = document
  }

  // ------------------------------------------
  // BASIC TYPE CONSTRUCTORS
  // ------------------------------------------

  /**
   * Given a value already hashed creates a Record containing it.
   * @param  {string} hash Hexadecimal string without prefix and length 64.
   * @returns {Record} Record object of the hashed input.
   */
  static fromHash(hash: string): Record {
    return new Record(hash)
  }
  /**
   * Given a hexadecimal string (with no 0x prefix) returns a Record with its value hashed.
   * @param  {string} hex Hexadecimal string without prefix.
   * @returns {Record} Record object of the hashed input.
   */
  static fromHex(hex: string): Record {
    const dataArray = hexToBytes(hex)
    return new Record(this.hashAlgorithm.generateHash(dataArray))
  }
  /**
   * Given a string returns a Record with its value hashed.
   * @param  {string} _string String object.
   * @returns {Record} Record object of the hashed input.
   */
  static fromString(_string: string): Record {
    const dataArray = stringToBytes(_string)
    return new Record(this.hashAlgorithm.generateHash(dataArray))
  }
  /**
   * Given a bytes object returns a Record with its value hashed.
   * @param  {TypedArray} src TypedArray object.
   * @returns {Record} Record object of the hashed input.
   */
  static fromTypedArray(src: TypedArray): Record {
    return new Record(this.hashAlgorithm.generateHash(src))
  }
  /**
   * Given a bytes object returns a Record with its value hashed.
   * @deprecated use fromTypedArray instead
   * @param  {Uint8Array} _uint8Array Bytes object.
   * @returns {Record} Record object of the hashed input.
   */
  static fromUint8Array(_uint8Array: Uint8Array): Record {
    return new Record(this.hashAlgorithm.generateHash(_uint8Array))
  }

  // ------------------------------------------
  // DOCUMENT CONSTRUCTORS
  // ------------------------------------------

  private static async fromDocument<D>(document: Document<D>): Promise<Record<D>> {
    await document.ready
    return new Record(this.hashAlgorithm.generateHash(document.getPayloadBytes()), document)
  }
  /**
   * Given a PDF file, returns a Record with its content hashed.
   * @param  {Uint8Array} _uint8Array Bytes object.
   * @returns {Record} Record object of the hashed input.
   */
  static async fromPDF(src: TypedArray): Promise<Record<TypedArray>> {
    let pdf = new PDFDocument(src)
    return Record.fromDocument(pdf)
  }
  /**
   * Given an JSON object, returns a Record with its value hashed.
   * @param  {any} data
   * @returns {Record} Record object of the hashed input.
   */
  static async fromJSON(src: JSONDocumentContent): Promise<Record<JSONDocumentContent>> {
    let json = new JSONDocument(src)
    return Record.fromDocument(json)
  }
  /**
   * Given an JSON object, returns a Record with its value hashed.
   * @deprecated use fromJSON method instead
   * @param  {any} data
   * @returns {Record} Record object of the hashed input.
   */
  static fromObject(data: any): Record {
    return Record.fromString(stringify(data))
  }

  // ------------------------------------------
  // HELPERS
  // ------------------------------------------

  static sort<T>(records: Record<T>[]): Record<T>[] {
    return records.sort((a: Record<T>, b: Record<T>) => {
      const first = a.getHash().toUpperCase()
      const second = b.getHash().toUpperCase()
      return first < second ? -1 : first > second ? 1 : 0
    })
  }
  /**
   * Given a Record returns True if its contents are valid to be sent to Bloock's API or False otherwise.
   * @param  {Record} record Record object.
   * @returns {boolean} Boolean indicating if the Record is susceptible to be sent (True) or not (False).
   */
  static isValid<T>(record: Record<T>): boolean {
    if (record instanceof Record) {
      const _record = record.getHash()
      if (_record && _record.length === 64 && isHex(_record)) {
        return true
      }
    }

    return false
  }

  // ------------------------------------------
  // PUBLIC FUNCTIONS
  // ------------------------------------------

  /**
   * Returns the hashed representation of the Record string.
   * @returns {string} String containing the Record hash as a hexadecimal (with no "0x" prefix).
   */
  public getHash(): string {
    return this.hash
  }

  /**
   * Returns an updated version of the original data including optional metadata including signature and integrity proof attached
   * @returns {T} A new version of the original data in the same format
   */
  public async retrieve(): Promise<T | undefined> {
    return await this.document?.build()
  }

  public getUint8ArrayHash(): Uint8Array {
    return hexToBytes(this.hash)
  }

  public async sign(privateKey: string): Promise<Record> {
    if (this.document) {
      const signature = await this.signing.sign(this.document.getDataBytes(), privateKey)
      this.document = await this.document.addSignature(signature)

      return new Record(
        Record.hashAlgorithm.generateHash(this.document.getPayloadBytes()),
        this.document
      )
    }

    throw new InvalidRecordTypeException()
  }

  public async verify(): Promise<boolean> {
    if (this.document) {
      let signatures = this.document.getSignatures()
      if (signatures) {
        return await this.signing.verify(this.document.getDataBytes(), ...signatures)
      } else {
        throw new NoSignatureFoundExceptin()
      }
    }

    return true
  }

  public getProof(): Proof | undefined {
    return this.document ? this.document?.getProof() : undefined
  }

  public setProof(proof: Proof): void {
    if (this.document) {
      this.document.setProof(proof)
    }
  }
}
