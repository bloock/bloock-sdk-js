import { WaitAnchorTimeoutException } from '../src/anchor/entity/exception/timeout.exception'
import { ConfigEnv } from '../src/config/entity/config-env.entity'
import { EnchainteClient, Message } from '../src/index'
import { HttpRequestException } from '../src/infrastructure/http/exception/http.exception'
import { InvalidMessageException } from '../src/message/entity/exception/invalid-message.exception'
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

function getSdk(): EnchainteClient {
  const apiKey = process.env['API_KEY'] || ''
  return new EnchainteClient(apiKey, ConfigEnv.TEST)
}

describe('Acceptance Tests', () => {
  test('test_basic_e2e', async () => {
    const sdk = getSdk()

    const messages = [Message.fromString(randHex(64))]

    const sendReceipt = await sdk.sendMessages(messages)
    if (!sendReceipt) {
      expect(false)
      return
    }

    await sdk.waitAnchor(sendReceipt[0].anchor)

    // Retrieving message proof
    const proof = await sdk.getProof(messages)
    const timestamp = await sdk.verifyProof(proof)
    expect(timestamp).toBeGreaterThan(0)
  })

  test('test_send_messages_invalid_message_input_wrong_char', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.sendMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_send_messages_invalid_message_input_missing_chars', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.sendMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_send_messages_invalid_message_input_wrong_start', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.sendMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_send_messages_invalid_message_input_string', async () => {
    const sdk = getSdk()
    const messages = 'e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'

    await expect(sdk.sendMessages(messages as any)).rejects.toEqual(new InvalidArgumentException())
  })

  test('test_send_messages_empty_message_input', async () => {
    const sdk = getSdk()

    const result = await sdk.sendMessages([])

    expect(result).toEqual([])
  })

  test('test_get_messages_invalid_message_input_wrong_char', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.getMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_get_messages_invalid_message_input_missing_chars', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.getMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_get_messages_invalid_message_input_wrong_start', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.getMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_get_anchor_non_existing_anchor', async () => {
    const sdk = getSdk()

    await expect(sdk.getAnchor(666666666666666666)).rejects.toEqual(
      new HttpRequestException('Anchor not found')
    )
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

  test('test_get_proof_invalid_message_input_wrong_char', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.getProof(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_get_proof_invalid_message_input_missing_chars', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.getProof(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_get_proof_invalid_message_input_wrong_start', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.getProof(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_get_proof_empty_message_input', async () => {
    const sdk = getSdk()

    await expect(sdk.getProof([])).rejects.toEqual(new InvalidArgumentException())
  })

  test('test_get_proof_none_existing_leaf', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
    ]

    await expect(sdk.getProof(messages)).rejects.toEqual(
      new HttpRequestException(
        "Message '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' not found."
      )
    )
  })

  test('test_verify_messages_invalid_message_input_wrong_char', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aG')
    ]

    await expect(sdk.verifyMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_verify_messages_invalid_message_input_missing_chars', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('e016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994')
    ]

    await expect(sdk.verifyMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_verify_messages_invalid_message_input_wrong_start', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.verifyMessages(messages)).rejects.toEqual(new InvalidMessageException())
  })

  test('test_verify_messages_empty_message_input', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994aa'),
      Message.fromHash('0xe016214a5c4abb88b8b614a916b1a6f075dfcf6fbc16c1e9d6e8ebcec81994bb')
    ]

    await expect(sdk.verifyMessages([])).rejects.toEqual(new InvalidArgumentException())
  })

  test('test_verify_messages_none_existing_leaf', async () => {
    const sdk = getSdk()
    const messages = [
      Message.fromHash('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
    ]

    await expect(sdk.verifyMessages(messages)).rejects.toEqual(
      new HttpRequestException(
        "Message '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' not found."
      )
    )
  })
})
