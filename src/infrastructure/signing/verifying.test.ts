import { stringToBytes, TypedArray } from '../../shared/utils'
import { Signature, SigningClient } from '../signing.client'
import { JWSClient } from './jws'

describe('Verifying jws tests', () => {
  const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
  const payload: TypedArray = stringToBytes('hello world')
  const headers: { [name: string]: string } = { optional: 'optional' }

  it('JWSVerify_valid_jws', async () => {
    const signing: SigningClient = new JWSClient()
    let response = await signing.sign(payload, privateKey, headers)
    expect(await signing.verify(payload, response)).toBeTruthy()
  })

  it('JWSVerify_valid_jws_no_headers', async () => {
    const signing: SigningClient = new JWSClient()
    let response = await signing.sign(payload, privateKey)
    expect(await signing.verify(payload, response)).toBeTruthy()
  })

  it('JWSVerify_kid_jws_not_found', async () => {
    const signing: SigningClient = new JWSClient()
    let response: Signature[] = [{ signature: '', header: {} }]

    await expect(signing.verify(payload, ...response)).rejects.toEqual('kid header not found')
  })

  it('JWSVerify_alg_not_defined', async () => {
    const signing: SigningClient = new JWSClient()
    let response: Signature = {
      signature:
        '4NIuhdR9Hhg7tlU0sxup3cdPCw39chGLbLg0_rsvD9PTMjt0jzERHtqqeD_e4BLFq4QY6WF9xFuNm9lIQoEqpw',
      header: {
        kty: 'EC',
        crv: 'secp256k1',
        alg: '',
        kid: '042f809cad1aab1935cbfc3c5f52f776d1420a9444a65f8c89432e14c66d887ecd193cc3007bdcac62b40df3ca030a4e04be1a81f7c795b62dc6aa8ac56ba18a7e'
      }
    }

    await expect(signing.verify(payload, response)).rejects.toBeTruthy()
  })

  it('JWSVerify_signature_not_defined', async () => {
    const signing: SigningClient = new JWSClient()
    let response: Signature = {
      signature: '',
      header: {
        kty: 'EC',
        crv: 'secp256k1',
        alg: 'ES256K',
        kid: '042f809cad1aab1935cbfc3c5f52f776d1420a9444a65f8c89432e14c66d887ecd193cc3007bdcac62b40df3ca030a4e04be1a81f7c795b62dc6aa8ac56ba18a7e',
        pub: 'publicKey'
      }
    }

    await expect(signing.verify(payload, response)).rejects.toBeTruthy()
  })

  it('JWSVerify_invalid_public_key', async () => {
    const signing: SigningClient = new JWSClient()
    let response: Signature = {
      signature: '4NIuhdR9Hhg7tlU0sxup3cdPCw39chGLbLg0_rsvD9PTMjt0jzERHtqqeD_e4BLFq4QY6WF9xFuNm9lIQoEqpw',
      header: {
        kty: 'EC',
        crv: 'secp256k1',
        alg: 'ES256K',
        kid: 'invalid-public-key',
        pub: 'publicKey'
      }
    }

    await expect(signing.verify(payload, response)).rejects.toBeTruthy()
  })
})
