import { HashingClient } from '../../infrastructure/hashing.client'
import { Keccak } from '../../infrastructure/hashing/keccak'
import { Utils } from '../../shared/utils'

/**
 * Message is the class in charge of computing and storing the
 * value of the data sent to Bloock.
 * This class is intended to be used by calling "from" static
 * methods to create instances of Message.
 */
export class Message {
  private static hashAlgorithm: HashingClient = new Keccak()

  private hash: string

  private constructor(hash: string) {
    this.hash = hash
  }
  /**
   * Given an JSON object, returns a Message with its value hashed.
   * @param  {any} data
   * @returns {Message} Message object of the hashed input.
   */
  static fromObject(data: any): Message {
    return Message.fromString(Utils.stringify(data))
  }
  /**
   * Given a value already hashed creates a Message containing it.
   * @param  {string} hash Hexadecimal string without prefix and length 64.
   * @returns {Message} Message object of the hashed input.
   */
  static fromHash(hash: string): Message {
    return new Message(hash)
  }
  /**
   * Given a hexadecimal string (with no 0x prefix) returns a Message with its value hashed.
   * @param  {string} hex Hexadecimal string without prefix.
   * @returns {Message} Message object of the hashed input.
   */
  static fromHex(hex: string): Message {
    const dataArray = Utils.hexToBytes(hex)
    return new Message(this.hashAlgorithm.generateHash(dataArray))
  }
  /**
   * Given a string returns a Message with its value hashed.
   * @param  {string} _string String object.
   * @returns {Message} Message object of the hashed input.
   */
  static fromString(_string: string): Message {
    const dataArray = Utils.stringToBytes(_string)
    return new Message(this.hashAlgorithm.generateHash(dataArray))
  }
  /**
   * Given a bytes object returns a Message with its value hashed.
   * @param  {Uint8Array} _uint8Array Bytes object.
   * @returns {Message} Message object of the hashed input.
   */
  static fromUint8Array(_uint8Array: Uint8Array): Message {
    return new Message(this.hashAlgorithm.generateHash(_uint8Array))
  }

  static sort(messages: Message[]): Message[] {
    return messages.sort((a: Message, b: Message) => {
      const first = a.getHash().toUpperCase()
      const second = b.getHash().toUpperCase()
      return first < second ? -1 : first > second ? 1 : 0
    })
  }
  /**
   * Given a Message returns True if its contents are valid to be sent to Bloock's API or False otherwise.
   * @param  {Message} message Message object.
   * @returns {boolean} Boolean indicating if the Message is susceptible to be sent (True) or not (False).
   */
  static isValid(message: Message): boolean {
    if (message instanceof Message) {
      const _message = message.getHash()
      if (_message && _message.length === 64 && Utils.isHex(_message)) {
        return true
      }
    }

    return false
  }
  /**
   * Returns the hashed representation of the Message string.
   * @returns {string} String containing the Message hash as a hexadecimal (with no "0x" prefix).
   */
  public getHash(): string {
    return this.hash
  }

  public getUint8ArrayHash(): Uint8Array {
    return Utils.hexToBytes(this.hash)
  }
}
