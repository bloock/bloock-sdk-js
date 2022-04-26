import { ConfigData } from '../../config/repository/config-data'
import { stringToBytes, TypedArray } from '../../shared/utils'
import { SigningClient } from '../signing.client'
import { JWSClient } from './jws'

describe('Signing jws tests', () => {
  const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
  const payload: TypedArray = stringToBytes('hello world')
  const headers: { [name: string]: string } = { optional: 'optional' }
  const configData: ConfigData = new ConfigData()

  it('JWSSign_valid_with_headers', async () => {
    const signing: SigningClient = new JWSClient()
    let signature = await signing.sign(payload, privateKey, headers)

    expect(signature).toBeTruthy()
    expect(signature.header.alg).toEqual(configData.config.SIGNATURE_ALGORITHM)
    expect(signature.header.crv).toEqual(configData.config.ELLIPTIC_CURVE_KEY)
    expect(signature.header.kty).toEqual(configData.config.KEY_TYPE_ALGORITHM)
    expect(signature.header.kid).toEqual(
      '04f21b2b2fec758670c2906e685afa6bdec4a3655a2bcd5f12cabf0ebfbcc83d44eba21d1ba84e520cdd163d510a1e27f8f803c0ad941c7b50a91bd5e11556edaf'
    )
    expect(signature.header.optional).toEqual('optional')
  })

  it('JWSSign_valid_with_no_headers', async () => {
    const signing: SigningClient = new JWSClient()
    let signature = await signing.sign(payload, privateKey)

    expect(signature).toBeTruthy()
    expect(signature.header.alg).toEqual(configData.config.SIGNATURE_ALGORITHM)
    expect(signature.header.crv).toEqual(configData.config.ELLIPTIC_CURVE_KEY)
    expect(signature.header.kty).toEqual(configData.config.KEY_TYPE_ALGORITHM)
  })

  it('JWSSign_invalid_without_private_key', async () => {
    const signing: SigningClient = new JWSClient()

    await expect(signing.sign(payload, '', headers)).rejects.toEqual('undefined private key')
  })

  it('JWSSign_invalid_length_private_key', async () => {
    const signing: SigningClient = new JWSClient()

    await expect(
      signing.sign(
        payload,
        'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c945',
        headers
      )
    ).rejects.toBeTruthy()
  })

  it('JWSSign_invalid_private_key', async () => {
    const signing: SigningClient = new JWSClient()

    await expect(signing.sign(payload, 'invalid-private-key', headers)).rejects.toBeTruthy()
  })

  it('JWSSign_invalid_private_key_other_address_format', async () => {
    const signing: SigningClient = new JWSClient()

    await expect(
      signing.sign(payload, 'QU2jsEnrroQ9isMzBKHS4brYreBUzp62GhVd2b5qafi7XrYsv3Lq', headers)
    ).rejects.toBeTruthy()
  })

  it('JWSSign_invalid_private_key_doge_address_format', async () => {
    const signing: SigningClient = new JWSClient()

    await expect(
      signing.sign(payload, 'QU2jsEnrroQ9isMzBKHS4brYreBUzp62GhVd2b5qafi7XrYsv3Lq', headers)
    ).rejects.toBeTruthy()
  })

  it('JWSSign_invalid_private_key_invalid_character', async () => {
    const signing: SigningClient = new JWSClient()

    await expect(
      signing.sign(
        payload,
        'ecb8e5+4bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457',
        headers
      )
    ).rejects.toBeTruthy()
  })
})
