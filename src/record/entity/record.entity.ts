import { HashingClient } from '../../infrastructure/hashing.client'
import { Keccak } from '../../infrastructure/hashing/keccak'
import { Utils } from '../../shared/utils'

/**
 * Record is the class in charge of computing and storing the
 * value of the data sent to Bloock.
 * This class is intended to be used by calling "from" static
 * methods to create instances of Record.
 */
export class Record {
  private static hashAlgorithm: HashingClient = new Keccak()

  private hash: string

  private constructor(hash: string) {
    this.hash = hash
  }
  /**
   * Given an JSON object, returns a Record with its value hashed.
   * @param  {any} data
   * @returns {Record} Record object of the hashed input.
   */
  static fromObject(data: any): Record {
    return Record.fromString(Utils.stringify(data))
  }
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
    const dataArray = Utils.hexToBytes(hex)
    return new Record(this.hashAlgorithm.generateHash(dataArray))
  }
  /**
   * Given a string returns a Record with its value hashed.
   * @param  {string} _string String object.
   * @returns {Record} Record object of the hashed input.
   */
  static fromString(_string: string): Record {
    const dataArray = Utils.stringToBytes(_string)
    return new Record(this.hashAlgorithm.generateHash(dataArray))
  }
  /**
   * Given a bytes object returns a Record with its value hashed.
   * @param  {Uint8Array} _uint8Array Bytes object.
   * @returns {Record} Record object of the hashed input.
   */
  static fromUint8Array(_uint8Array: Uint8Array): Record {
    return new Record(this.hashAlgorithm.generateHash(_uint8Array))
  }

  static sort(records: Record[]): Record[] {
    return records.sort((a: Record, b: Record) => {
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
  static isValid(record: Record): boolean {
    if (record instanceof Record) {
      const _record = record.getHash()
      if (_record && _record.length === 64 && Utils.isHex(_record)) {
        return true
      }
    }

    return false
  }
  /**
   * Returns the hashed representation of the Record string.
   * @returns {string} String containing the Record hash as a hexadecimal (with no "0x" prefix).
   */
  public getHash(): string {
    return this.hash
  }

  public getUint8ArrayHash(): Uint8Array {
    return Utils.hexToBytes(this.hash)
  }


}
