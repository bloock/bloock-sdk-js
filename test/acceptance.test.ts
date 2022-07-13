import { Anchor } from '../src/anchor/entity/anchor.entity'
import { WaitAnchorTimeoutException } from '../src/anchor/entity/exception/timeout.exception'
import { BloockClient, Network, Proof, Record } from '../src/index'
import { HttpRequestException } from '../src/infrastructure/http/exception/http.exception'
import { JSONDocument } from '../src/record/entity/document/json'
import { InvalidRecordException } from '../src/record/entity/exception/invalid-record.exception'
import { InvalidArgumentException } from '../src/shared/entity/exception/invalid-argument.exception'

function randHex(len: number): string {
  const maxlen = 8
  const min = Math.pow(16, Math.min(len, maxlen) - 1)
  const max = Math.pow(16, Math.min(len, maxlen)) - 1
  const n = Math.floor(Math.random() * (max - min + 1)) + min
  let r = n.toString(16)
  while (r.length < len) {
    r = r + randHex(len - maxlen)
  }
  return r
}

function getSdk(): BloockClient {
  const apiKey = process.env['API_KEY'] || ''
  const apiHost = process.env['API_HOST'] || ''
  let client = new BloockClient(apiKey)
  client.setApiHost(apiHost)
  return client
}

describe('Acceptance Tests', () => {
  test('test_basic_e2e', async () => {
    jest.setTimeout(120000)

    const sdk = getSdk()
    
    const records = [Record.fromString(randHex(64))]

    const sendReceipt = await sdk.sendRecords(records)
    if (!sendReceipt) {
      expect(false)
      return
    }

    await sdk.waitAnchor(sendReceipt[0].anchor)

    // Retrieving record proof
    const proof = await sdk.getProof(records)
    const root = await sdk.verifyProof(proof)
    const timestamp = await sdk.validateRoot(root, Network.BLOOCK_CHAIN)
    const isValid = await sdk.verifyRecords(records)

    expect(timestamp).toBeGreaterThan(0)
    expect(isValid).toBeGreaterThan(0)
  })

  test('test_send_records_invalid_record_input_wrong_char', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.sendRecords(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_send_records_invalid_record_input_missing_chars', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.sendRecords(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_send_records_invalid_record_input_wrong_start', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.sendRecords(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_send_records_invalid_record_input_string', async () => {
    const sdk = getSdk()
    const records = 'e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'

    await expect(sdk.sendRecords(records as any)).rejects.toEqual(new InvalidArgumentException())
  })

  test('test_send_records_empty_record_input', async () => {
    const sdk = getSdk()

    const result = await sdk.sendRecords([])

    expect(result).toEqual([])
  })

  test('test_get_records_invalid_record_input_wrong_char', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.getRecords(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_get_records_invalid_record_input_missing_chars', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.getRecords(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_get_records_invalid_record_input_wrong_start', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.getRecords(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_get_anchor_invalid_input', async () => {
    const sdk = getSdk()

    await expect(sdk.getAnchor('anchor' as any)).rejects.toEqual(new InvalidArgumentException())
  })

  test('test_wait_anchor_non_existing_anchor', async () => {
    const sdk = getSdk()

    await expect(sdk.waitAnchor(666666666666666666, 3000)).rejects.toEqual(
      new WaitAnchorTimeoutException()
    )
  })

  test('test_wait_anchor_invalid_input', async () => {
    const sdk = getSdk()

    await expect(sdk.waitAnchor('anchor' as any)).rejects.toEqual(new InvalidArgumentException())
  })

  test('test_get_proof_invalid_record_input_wrong_char', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.getProof(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_get_proof_invalid_record_input_missing_chars', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.getProof(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_get_proof_invalid_record_input_wrong_start', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.getProof(records)).rejects.toEqual(new InvalidRecordException())
  })

  test('test_get_proof_empty_record_input', async () => {
    const sdk = getSdk()

    await expect(sdk.getProof([])).rejects.toEqual(new InvalidArgumentException())
  })

  test('test_get_proof_none_existing_leaf', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
    ]

    await expect(sdk.getProof(records)).rejects.toEqual(
      new HttpRequestException(
        "Record '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' not found."
      )
    )
  })

  test('test_set_proof_from_document_without_proof', async () => {
    const sdk = getSdk()
    let json = { hello: 'world' }
    let document = new JSONDocument(json)
    await document.ready
    let record = await Record.fromJSON(document)
    const records = [record]

    const sendReceipt = await sdk.sendRecords(records)
    if (!sendReceipt) {
      expect(false)
      return
    }
    await sdk.waitAnchor(sendReceipt[0].anchor)

    let proof = await sdk.getProof(records)

    expect(proof).toEqual(records[0].getProof())
  })

  test('test_get_proof_from_document_with_proof', async () => {
    const sdk = getSdk()
    let data = { hello: 'world' }
    let json = new JSONDocument(data)
    await json.ready
    let record = await Record.fromJSON(json)
    const records = [record]

    const proof = new Proof(
      ['leave1'],
      ['node1'],
      'depth',
      'bitmap',
      new Anchor(1, [''], [], '', 'pending')
    )
    await json.setProof(proof)

    let result = await sdk.getProof(records)

    expect(result).toEqual(records[0].getProof())
  })

  test('test_verify_records_invalid_record_input_wrong_char', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.verifyRecords(records, Network.BLOOCK_CHAIN)).rejects.toEqual(
      new InvalidRecordException()
    )
  })

  test('test_verify_records_invalid_record_input_missing_chars', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.verifyRecords(records, Network.BLOOCK_CHAIN)).rejects.toEqual(
      new InvalidRecordException()
    )
  })

  test('test_verify_records_invalid_record_input_wrong_start', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.verifyRecords(records, Network.BLOOCK_CHAIN)).rejects.toEqual(
      new InvalidRecordException()
    )
  })

  test('test_verify_records_empty_record_input', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.verifyRecords([], Network.BLOOCK_CHAIN)).rejects.toEqual(
      new InvalidArgumentException()
    )
  })

  test('test_verify_records_empty_record_input', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Record.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.verifyRecords([], Network.BLOOCK_CHAIN)).rejects.toEqual(
      new InvalidArgumentException()
    )
  })

  test('test_verify_records_none_existing_leaf', async () => {
    const sdk = getSdk()
    const records = [
      Record.fromHash('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
    ]

    await expect(sdk.verifyRecords(records, Network.BLOOCK_CHAIN)).rejects.toEqual(
      new HttpRequestException(
        "Record '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' not found."
      )
    )
  })
})
