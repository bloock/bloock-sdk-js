import { Signature } from "../../record/entity/document/signature"
import { SigningClient } from "../signing.client"
import { Signing } from "./signing"


describe('Verifying jws tests', () => {
  const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
  const payload: string = '32e3971ea882d3e46ed788888cfa747958a0999c0338c98126a5ed57f53bee60'
  const headers: { [name: string]: string } = { 'optional': 'optional' }

  it('JWSVerify_valid_jws', async () => {
    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(privateKey, payload, headers)

    expect(await signing.JWSVerify(response)).toBeUndefined()
  })

  it('JWSVerify_kid_jws_not_found', async () => {
    const signing: SigningClient = new Signing()
    let response: Signature = { payload: '', signatures: [{ signature: '', header: {} }] }

    await expect(signing.JWSVerify(response)).rejects.toEqual('kid header not found')
  })

  it('JWSVerify_alg_not_defined', async () => {
    const signing: SigningClient = new Signing()
    let response: Signature = {
      payload: 'MzJlMzk3MWVhODgyZDNlNDZlZDc4ODg4OGNmYTc0Nzk1OGEwOTk5YzAzMzhjOTgxMjZhNWVkNTdmNTNiZWU2MA',
      signatures: [{
        signature: 'ex7kLphJBNJmdx5tngZE0hP5KoS8VP_XAQzWfbFyeb6wceIxZjACSn19GF14wfr-TAZCwTV7o9o58jOkLkOOyQ',
        header: {
          kty: 'EC',
          crv: 'secp256k1',
          alg: '',
          kid: '-----BEGIN PUBLIC KEY-----\n' +
            'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE8hsrL+x1hnDCkG5oWvpr3sSjZVorzV8S\n' +
            'yr8Ov7zIPUTroh0bqE5SDN0WPVEKHif4+APArZQce1CpG9XhFVbtrw==\n' +
            '-----END PUBLIC KEY-----\n',
          pub: 'publicKey'
        }
      }]
    }

    await expect(signing.JWSVerify(response)).rejects.toBeTruthy()
  })

  it('JWSVerify_signature_not_defined', async () => {
    const signing: SigningClient = new Signing()
    let response: Signature = {
      payload: 'MzJlMzk3MWVhODgyZDNlNDZlZDc4ODg4OGNmYTc0Nzk1OGEwOTk5YzAzMzhjOTgxMjZhNWVkNTdmNTNiZWU2MA',
      signatures: [{
        signature: '',
        header: {
          kty: 'EC',
          crv: 'secp256k1',
          alg: 'ES256K',
          kid: '-----BEGIN PUBLIC KEY-----\n' +
            'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE8hsrL+x1hnDCkG5oWvpr3sSjZVorzV8S\n' +
            'yr8Ov7zIPUTroh0bqE5SDN0WPVEKHif4+APArZQce1CpG9XhFVbtrw==\n' +
            '-----END PUBLIC KEY-----\n',
          pub: 'publicKey'
        }
      }]
    }

    await expect(signing.JWSVerify(response)).rejects.toBeTruthy()
  })
})