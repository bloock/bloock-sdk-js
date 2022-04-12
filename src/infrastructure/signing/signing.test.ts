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
})
