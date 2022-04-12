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

  it('JWSVerify_invalid_private_key', async () => {
    const signing: SigningClient = new JWSClient()
    let response = await signing.sign(payload, 'private-key')
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
        'ex7kLphJBNJmdx5tngZE0hP5KoS8VP_XAQzWfbFyeb6wceIxZjACSn19GF14wfr-TAZCwTV7o9o58jOkLkOOyQ',
      header: {
        kty: 'EC',
        crv: 'secp256k1',
        alg: '',
        kid:
          '-----BEGIN PUBLIC KEY-----\n' +
          'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE8hsrL+x1hnDCkG5oWvpr3sSjZVorzV8S\n' +
          'yr8Ov7zIPUTroh0bqE5SDN0WPVEKHif4+APArZQce1CpG9XhFVbtrw==\n' +
          '-----END PUBLIC KEY-----\n',
        pub: 'publicKey'
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
        kid:
          '-----BEGIN PUBLIC KEY-----\n' +
          'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE8hsrL+x1hnDCkG5oWvpr3sSjZVorzV8S\n' +
          'yr8Ov7zIPUTroh0bqE5SDN0WPVEKHif4+APArZQce1CpG9XhFVbtrw==\n' +
          '-----END PUBLIC KEY-----\n',
        pub: 'publicKey'
      }
    }

    await expect(signing.verify(payload, response)).rejects.toBeTruthy()
  })
})
