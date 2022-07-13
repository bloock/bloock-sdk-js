import fs from 'fs'
import { BloockClient, Network, Record, RecordReceipt } from '../src'
import { Anchor } from '../src/anchor/entity/anchor.entity'
import { PDFDocument } from '../src/record/entity/document/pdf'

function getSdk(): BloockClient {
  const apiKey = process.env['API_KEY'] || ''
  const apiHost = process.env['API_HOST'] || ''
  let client = new BloockClient(apiKey)
  client.setApiHost(apiHost)
  return client
}

describe('Functional Tests', () => {
  test('testSendRecord', async () => {
    jest.setTimeout(120000)

    const sdk = getSdk()

    const records = [
      Record.fromString('Example Data 1'),
      Record.fromString('Example Data 2'),
      Record.fromString('Example Data 3')
    ]

    const sendReceipt = await sdk.sendRecords(records)
    expect(Array.isArray(sendReceipt)).toBeTruthy()
    expect(sendReceipt[0]).toBeInstanceOf(RecordReceipt)
    expect(sendReceipt[0].anchor).toBeGreaterThan(0)
    expect(sendReceipt[0].client.length).toBeGreaterThan(0)
    expect(sendReceipt[0].record).toEqual(records[0].getHash())
    expect(sendReceipt[0].status).toEqual('Pending')
  })

  test('testWaitAnchor', async () => {
    jest.setTimeout(120000)

    const sdk = getSdk()

    const records = [
      Record.fromString('Example Data 1'),
      Record.fromString('Example Data 2'),
      Record.fromString('Example Data 3')
    ]

    const sendReceipt = await sdk.sendRecords(records)
    expect(sendReceipt).toBeDefined()
    expect(Array.isArray(sendReceipt)).toBeTruthy()
    expect(sendReceipt[0]).toBeInstanceOf(RecordReceipt)

    let receipt = await sdk.waitAnchor(sendReceipt[0].anchor)
    expect(receipt).toBeDefined()
    expect(receipt).toBeInstanceOf(Anchor)
    expect(receipt.id).toBeGreaterThan(0)
    expect(receipt.blockRoots.length).toBeGreaterThan(0)
    expect(receipt.networks.length).toBeGreaterThan(0)
    expect(receipt.root.length).toBeGreaterThan(0)
    expect(receipt.status.length).toBeGreaterThan(0)
  })

  test('testFetchRecords', async () => {
    jest.setTimeout(120000)

    const sdk = getSdk()

    const records = [
      Record.fromString('Example Data 1'),
      Record.fromString('Example Data 2'),
      Record.fromString('Example Data 3')
    ]

    const sendReceipt = await sdk.sendRecords(records)

    if (!sendReceipt) {
      expect(false)
      return
    }

    await sdk.waitAnchor(sendReceipt[0].anchor)

    let recordReceipts = await sdk.getRecords(records)
    for (let recordReceipt of recordReceipts) {
      expect(recordReceipt.status).toBe('Success')
    }
  })

  test('testGetProof', async () => {
    jest.setTimeout(120000)

    const sdk = getSdk()

    const records = [
      Record.fromString('Example Data 1'),
      Record.fromString('Example Data 2'),
      Record.fromString('Example Data 3')
    ]

    let proof = await sdk.getProof(records)
    expect(proof).toBeDefined()
  })

  test('testVerifyProof & testValidateProof', async () => {
    jest.setTimeout(120000)

    const sdk = getSdk()

    const records = [
      Record.fromString('Example Data 1'),
      Record.fromString('Example Data 2'),
      Record.fromString('Example Data 3')
    ]

    let proof = await sdk.getProof(records)
    expect(proof).toBeDefined()

    let root = await sdk.verifyProof(proof)
    expect(root).toBeDefined()

    let timestamp = await sdk.validateRoot(root, Network.BLOOCK_CHAIN)
    expect(timestamp).toBeGreaterThan(0)
  })

  test('testEncryptDocument', async () => {
      jest.setTimeout(120000)

      const sdk = getSdk()

      const bytes = fs.readFileSync('./test/assets/dummy.pdf')
      let file = new PDFDocument(bytes)
      await file.ready

      const secretKey = await sdk.generateSecretKey()
      expect(secretKey).toBeTruthy()

      let encryptedData = await sdk.encryptData(file.getDataBytes(), secretKey)
      expect(encryptedData).toBeTruthy()
      expect(encryptedData.ciphertext).toBeTruthy()

      let decryptedData = await sdk.decryptData(encryptedData, secretKey)
      expect(decryptedData).toBeTruthy()
      expect(decryptedData).toEqual(file.getDataBytes())
  })
})
