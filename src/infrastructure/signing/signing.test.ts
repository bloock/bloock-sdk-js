import { ConfigData } from "../../config/repository/config-data"
import { SigningClient } from "../signing.client"
import { Signing } from "./signing"


describe('Signing jws tests', () => {
  const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
  const payload: string = '32e3971ea882d3e46ed788888cfa747958a0999c0338c98126a5ed57f53bee60'
  const headers: { [name: string]: string } = { 'optional': 'optional' }
  const configData: ConfigData = new ConfigData()

  it('JWSSign_valid_with_headers', async () => {
    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(privateKey, payload, headers)

    expect(response.payload).toBeTruthy()
    expect(response.signatures[0].header.alg).toEqual(configData.config.SIGNATURE_ALGORITHM)
    expect(response.signatures[0].header.crv).toEqual(configData.config.ELLIPTIC_CURVE_KEY)
    expect(response.signatures[0].header.kty).toEqual(configData.config.KEY_TYPE_ALGORITHM)
    expect(response.signatures[0].header.optional).toEqual('optional')
  })

  it('JWSSign_valid_with_no_headers', async () => {
    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(privateKey, payload)

    expect(response.payload).toBeTruthy()
    expect(response.signatures[0].header.alg).toEqual(configData.config.SIGNATURE_ALGORITHM)
    expect(response.signatures[0].header.crv).toEqual(configData.config.ELLIPTIC_CURVE_KEY)
    expect(response.signatures[0].header.kty).toEqual(configData.config.KEY_TYPE_ALGORITHM)
  })

  it('JWSSign_invalid_without_private_key', async () => {

    const signing: SigningClient = new Signing()

    await expect(signing.JWSSign('', payload, headers)).rejects.toEqual('undefined private key')
  })

})