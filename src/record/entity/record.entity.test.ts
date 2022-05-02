import * as fs from 'fs'
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

  it('test_from_typedarray', () => {
    // prettier-ignore
    let array = Uint8Array.from([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
      16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
      17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17,
      17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17])

    expect(Record.fromTypedArray(array).getHash()).toEqual(
      'e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994a5'
    )
  })

  it('test_from_pdf', async () => {
    let bytes = fs.readFileSync('./test/assets/dummy.pdf')
    let record = await Record.fromPDF(bytes)

    expect(record.getHash()).toEqual(
      'cd5d993c67b0fe1f46e5169cdee04072ee72b3b110580f052988b3e6f8726f10'
    )
  })

  it('test_from_pdf_with_metadata', async () => {
    let bytes = fs.readFileSync('./test/assets/dummy-with-metadata.pdf')
    let record = await Record.fromPDF(bytes)

    expect(record.getHash()).toEqual(
      'c17a41c48474209c83dad03acee7a7e7cddd2f474de0466084c44e3e72acc3f0'
    )
  })

  it('test_from_pdf_sign', async () => {
    let bytes = fs.readFileSync('./test/assets/dummy.pdf')
    let record = await Record.fromPDF(bytes)
    record = await record.sign('ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457')

    expect(await record.verify()).toBeTruthy()

    let outputBytes = await record.retrieve()
    expect(outputBytes).toBeTruthy()

    if (outputBytes) {
      let record2 = await Record.fromPDF(outputBytes)
      expect(await record2.verify()).toBeTruthy()
    }
  })

  it('test_from_json', async () => {
    let json = {
      hello: 'world'
    }
    let record = await Record.fromJSON(json)

    expect(record.getHash()).toEqual(
      '586e9b1e1681ba3ebad5ff5e6f673d3e3aa129fcdb76f92083dbc386cdde4312'
    )
  })

  it('test_from_json_with_metadata', async () => {
    let json = {
      _data_: {
        hello: 'world'
      },
      _metadata_: {
        signatures: [{ signature: 'signature1', header: {} }]
      }
    }
    let record = await Record.fromJSON(json)

    expect(record.getHash()).toEqual(
      '040b3fc3bb0a00d5056c6c18695ef13875cda75d97d7333ef5e8272befa4ae06'
    )
  })

  it('test_from_json_sign', async () => {
    let json = {
      hello: 'world'
    }
    let record = await Record.fromJSON(json)
    let hash = record.getHash()
    record = await record.sign('ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457')
    let hash2 = record.getHash()

    expect(hash == hash2).toBeFalsy()

    let output = await record.retrieve()

    expect(await record.verify()).toBeTruthy()

    output = await record.retrieve()
    expect(output).toBeTruthy()

    if (output) {
      let record2 = await Record.fromJSON(output)
      expect(await record2.verify()).toBeTruthy()
    }
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
