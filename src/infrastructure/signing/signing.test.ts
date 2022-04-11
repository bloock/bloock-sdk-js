import { ConfigData } from "../../config/repository/config-data"
import { KeyPair } from "../../record/entity/document/signature/signature"
import { SigningClient } from "../signing.client"
import { Signing } from "./signing"


describe('Signing jws tests', () => {
  const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
  const publicKey = '04f21b2b2fec758670c2906e685afa6bdec4a3655a2bcd5f12cabf0ebfbcc83d44eba21d1ba84e520cdd163d510a1e27f8f803c0ad941c7b50a91bd5e11556edaf'
  const keyPair: KeyPair = new KeyPair(privateKey, publicKey)
  const payload: string = '32e3971ea882d3e46ed788888cfa747958a0999c0338c98126a5ed57f53bee60'
  const headers: { [name: string]: string } = { 'optional': 'optional' }
  const configData: ConfigData = new ConfigData()

  it('JWSSign_valid_with_headers', async () => {
    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(keyPair, payload, headers)

    expect(response.payload).toBeTruthy()
    expect(response.signatures[0].header.kid).toEqual(publicKey)
    expect(response.signatures[0].header.alg).toEqual(configData.config.SIGNATURE_ALGORITHM)
    expect(response.signatures[0].header.crv).toEqual(configData.config.ELLIPTIC_CURVE_KEY)
    expect(response.signatures[0].header.kty).toEqual(configData.config.KEY_TYPE_ALGORITHM)
    expect(response.signatures[0].header.optional).toEqual('optional')
  })

  it('JWSSign_valid_with_no_headers', async () => {
    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(keyPair, payload)

    expect(response.payload).toBeTruthy()
    expect(response.signatures[0].header.kid).toEqual(publicKey)
    expect(response.signatures[0].header.alg).toEqual(configData.config.SIGNATURE_ALGORITHM)
    expect(response.signatures[0].header.crv).toEqual(configData.config.ELLIPTIC_CURVE_KEY)
    expect(response.signatures[0].header.kty).toEqual(configData.config.KEY_TYPE_ALGORITHM)
  })

  it('JWSSign_invalid_without_private_key', async () => {
    const privateKey = ''
    const publicKey = '04f21b2b2fec758670c2906e685afa6bdec4a3655a2bcd5f12cabf0ebfbcc83d44eba21d1ba84e520cdd163d510a1e27f8f803c0ad941c7b50a91bd5e11556edaf'
    const keyPair: KeyPair = new KeyPair(privateKey, publicKey)

    const signing: SigningClient = new Signing()

    await expect(signing.JWSSign(keyPair, payload, headers)).rejects.toBeTruthy()
  })

})