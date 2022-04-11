import { KeyPair } from "../../record/entity/document/signature/signature"
import { SigningClient } from "../signing.client"
import { Signing } from "../signing/signing"
import { VerifyingClient } from "../verifying.client"
import { Verifying } from "./verifying"


describe('Verifying jws tests', () => {
  const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
  const publicKey = '04f21b2b2fec758670c2906e685afa6bdec4a3655a2bcd5f12cabf0ebfbcc83d44eba21d1ba84e520cdd163d510a1e27f8f803c0ad941c7b50a91bd5e11556edaf'
  const keyPair: KeyPair = new KeyPair(privateKey, publicKey)
  const payload: string = '32e3971ea882d3e46ed788888cfa747958a0999c0338c98126a5ed57f53bee60'
  const headers: { [name: string]: string } = { 'optional': 'optional' }

  it('JWSVerify_valid_jws', async () => {
    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(keyPair, payload, headers)

    const verifying: VerifyingClient = new Verifying()
    expect(await verifying.JWSVerify(response)).toBeUndefined()
  })

  it('JWSVerify_invalid_key_pairs_matching', async () => {
    const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
    const invalidPublicKey = '0420b565cb5c4f8ca9e0202ef2f2bc9be42503515c44105e45da75bd3957fddb2677b6f15e2aaa3dda0d872160ec4dafac5659396097b64877437c27dc4a0b8af1'
    const invalidkeyPair: KeyPair = new KeyPair(privateKey, invalidPublicKey)
    const payload: string = '32e3971ea882d3e46ed788888cfa747958a0999c0338c98126a5ed57f53bee60'

    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(invalidkeyPair, payload)

    const verifying: VerifyingClient = new Verifying()
    await expect(verifying.JWSVerify(response)).rejects.toBeTruthy()
  })

  it('JWSVerify_invalid_elliptic_public_key', async () => {
    const privateKey = 'ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457'
    const invalidPublicKey = '1111b565cb5c4f8ca9e0202ef2f2bc9be42503515c44105e45da75bd3957fddb2677b6f15e2aaa3dda0d872160ec4dafac5659396097b64877437c27dc4a0b8af1'
    const invalidkeyPair: KeyPair = new KeyPair(privateKey, invalidPublicKey)
    const payload: string = '32e3971ea882d3e46ed788888cfa747958a0999c0338c98126a5ed57f53bee60'

    const signing: SigningClient = new Signing()
    let response = await signing.JWSSign(invalidkeyPair, payload)

    const verifying: VerifyingClient = new Verifying()
    await expect(verifying.JWSVerify(response)).rejects.toBeTruthy()
  })


})