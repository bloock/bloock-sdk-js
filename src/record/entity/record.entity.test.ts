import { Record } from './record.entity'

describe('Record entity tests', () => {
  it('test_from_hash', () => {
    const record = Record.fromHash('test_hash')

    expect(record.getHash()).toEqual('test_hash')
  })

  it('test_from_hex', () => {
    let s =
      '10101010101010101010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111111111111111111'
    let p = 'e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994a5'
    expect(Record.fromHex(s).getHash()).toEqual(p)
  })

  it('test_from_string', () => {
    let s = 'testing keccak'
    expect(Record.fromString(s).getHash()).toEqual(
      '7e5e383e8e70e55cdccfccf40dfc5d4bed935613dffc806b16b4675b555be139'
    )
  })

  it('test_from_uint8', () => {
    // prettier-ignore
    let array = Uint8Array.from([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17,
        17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17])

    expect(Record.fromUint8Array(array).getHash()).toEqual(
      'e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994a5'
    )
  })

  it('test_is_valid_okay', () => {
    const record = Record.fromHash(
      '1010101010101010101010101010101010101010101010101010101010101010'
    )

    expect(Record.isValid(record)).toBe(true)
  })

  it('test_is_valid_missing_char', () => {
    const record = '010101010101010101010101010101010101010101010101010101010101010'

    expect(Record.isValid(record as any)).toBe(false)
  })

  it('test_is_valid_wrong_char', () => {
    const record = 'G010101010101010101010101010101010101010101010101010101010101010'

    expect(Record.isValid(record as any)).toBe(false)
  })

  it('test_is_valid_not_record_instance', () => {
    const record = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef123g'

    expect(Record.isValid('test Record' as any)).toBe(false)
  })
})
