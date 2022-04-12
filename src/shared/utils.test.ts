import {
  bytesToHex,
  bytesToString,
  hexToBytes,
  hexToUint16,
  isHex,
  stringify,
  stringToBytes,
  uint16ToHex
} from './utils'

describe('Utils Tests', () => {
  it('is hex - success', () => {
    const hex = '123456789abcdef'

    expect(isHex(hex)).toBe(true)
  })

  it('is hex - error', () => {
    const hex = 'abcdefg'

    expect(isHex(hex)).toBe(false)
  })

  it('is uint16 to string - success', () => {
    const hex = '0100'
    var arr = hexToUint16(hex)
    expect(arr).toStrictEqual(new Uint16Array([256]))
    var arr2 = hexToBytes(hex)
    expect(arr2).toStrictEqual(new Uint8Array([1, 0]))
    expect(uint16ToHex(arr)).toStrictEqual(bytesToHex(new Uint8Array([1, 0])))
  })

  it('test string to bytes conversion', () => {
    const string = 'hello world'
    let bytes = stringToBytes(string)
    expect(bytes).toEqual(Uint8Array.from([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]))
    expect(bytesToString(bytes)).toEqual(string)
  })

  it('Check JSON normalized', () => {
    const data = {
      id: 1,
      name: 'Test'
    }

    const invertedData = {
      name: 'Test',
      id: 1
    }

    expect(stringify(data)).toEqual(stringify(invertedData))
  })
})
