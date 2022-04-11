import { Buffer } from 'buffer'
import stringifyLib from 'json-stable-stringify'
import { Record } from '../record/entity/record.entity'

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

export function stringify(data: any): string {
  return stringifyLib(data)
}

export function stringToBytes(string: string): Uint8Array {
  return Uint8Array.from(Buffer.from(string))
}

export function hexToBytes(hex: string): Uint8Array {
  if (!isHex(hex)) {
    throw 'Parameter is not hexadecimal.'
  } else if (hex.length % 2 == 1) {
    throw 'Parameter is missing last character to be represented in bytes.'
  }
  return Uint8Array.from(Buffer.from(hex, 'hex'))
}

export function hexToUint16(hex: string): Uint16Array {
  if (hex.length % 4 != 0) {
    throw 'Parameter is missing last characters to be represented in uint16.'
  }
  let bytes = hexToBytes(hex)
  let result = new Uint16Array(bytes.length / 2)

  var i
  for (i = 0; i < result.length; i++) {
    result[i] = bytes[i * 2 + 1] + (bytes[i * 2] << 8)
  }
  return result
}

export function bytesToHex(array: TypedArray): string {
  return Buffer.from(array).toString('hex')
}

export function uint16ToHex(array: Uint16Array): string {
  let result = new Uint8Array(array.length * 2)

  var i
  for (i = 0; i < array.length; i++) {
    result[i * 2 + 1] = array[i]
    result[i * 2] = array[i] >> 8
  }

  return bytesToHex(result)
}

export function isHex(h: string): boolean {
  const regexp = /^[0-9a-fA-F]+$/
  return regexp.test(h)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function merge(left: Uint8Array, right: Uint8Array): Uint8Array {
  const concat = new Uint8Array(left.length + right.length)
  concat.set(left)
  concat.set(right, left.length)

  return Record.fromUint8Array(concat).getUint8ArrayHash()
}
