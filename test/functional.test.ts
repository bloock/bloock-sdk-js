import { EnchainteClient, Message, MessageReceipt } from '../src'
import { Anchor } from '../src/anchor/entity/anchor.entity'

describe('Functional Tests', () => {
  test('testSendMessage', async () => {
    jest.setTimeout(120000)

    const apiKey = process.env['API_KEY'] || ''
    const sdk = new EnchainteClient(apiKey)

    const messages = [Message.fromString('Example Data')]

    const sendReceipt = await sdk.sendMessages(messages)
    expect(Array.isArray(sendReceipt)).toBeTruthy()
    expect(sendReceipt[0]).toBeInstanceOf(MessageReceipt)
    expect(sendReceipt[0].anchor).toBeGreaterThan(0)
    expect(sendReceipt[0].client.length).toBeGreaterThan(0)
    expect(sendReceipt[0].message).toEqual(messages[0].getHash())
    expect(sendReceipt[0].status).toEqual('Pending')
  })

  test('testWaitAnchor', async () => {
    jest.setTimeout(120000)

    const apiKey = process.env['API_KEY'] || ''
    const sdk = new EnchainteClient(apiKey)

    const messages = [
      Message.fromString('Example Data 1'),
      Message.fromString('Example Data 2'),
      Message.fromString('Example Data 3')
    ]

    const sendReceipt = await sdk.sendMessages(messages)
    expect(sendReceipt).toBeDefined()
    expect(Array.isArray(sendReceipt)).toBeTruthy()
    expect(sendReceipt[0]).toBeInstanceOf(MessageReceipt)

    let receipt = await sdk.waitAnchor(sendReceipt[0].anchor)
    expect(receipt).toBeDefined()
    expect(receipt).toBeInstanceOf(Anchor)
    expect(receipt.id).toBeGreaterThan(0)
    expect(receipt.blockRoots.length).toBeGreaterThan(0)
    expect(receipt.networks.length).toBeGreaterThan(0)
    expect(receipt.root.length).toBeGreaterThan(0)
    expect(receipt.status.length).toBeGreaterThan(0)
  })

  test('testFetchMessages', async () => {
    jest.setTimeout(120000)

    const apiKey = process.env['API_KEY'] || ''
    const sdk = new EnchainteClient(apiKey)

    const messages = [
      Message.fromString('Example Data 1'),
      Message.fromString('Example Data 2'),
      Message.fromString('Example Data 3')
    ]

    const sendReceipt = await sdk.sendMessages(messages)

    if (!sendReceipt) {
      expect(false)
      return
    }

    await sdk.waitAnchor(sendReceipt[0].anchor)

    let messageReceipts = await sdk.getMessages(messages)
    for (let messageReceipt of messageReceipts) {
      expect(messageReceipt.status).toBe('Success')
    }
  })

  test('testGetProof', async () => {
    jest.setTimeout(120000)

    const apiKey = process.env['API_KEY'] || ''
    const sdk = new EnchainteClient(apiKey)

    const messages = [
      Message.fromString('Example Data 1'),
      Message.fromString('Example Data 2'),
      Message.fromString('Example Data 3')
    ]

    let proof = await sdk.getProof(messages)
    expect(proof).toBeDefined()
  })
})
