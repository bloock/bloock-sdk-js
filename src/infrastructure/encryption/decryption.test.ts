import { stringToBytes, TypedArray } from "../../shared/utils"
import { EncryptionClient } from "../encryption.client"
import { JWEClient } from "./jwe"


describe('Decryption jwe tests', () => {
  const payload: TypedArray = stringToBytes('hello world')

  it('JWEDecrypt_valid_secret', async () => {
    const encryption: EncryptionClient = new JWEClient()
    const secret = await encryption.generateSecretKey()
    let encrypt = await encryption.encrypt(payload, secret)

    let decrypt = await encryption.decrypt(encrypt, secret)

    expect(decrypt).toEqual(payload)
  })

  it('JWEDecrypt_invalid_secret', async () => {
    const encryption: EncryptionClient = new JWEClient()
    const secret = await encryption.generateSecretKey()
    const diffSecret = await encryption.generateSecretKey()
    let encrypt = await encryption.encrypt(payload, secret)

    await expect(encryption.decrypt(encrypt, diffSecret)).rejects.toBeTruthy()
  })

  it('JWEDecrypt_empty_encrypt', async () => {
    const encryption: EncryptionClient = new JWEClient()
    const secret = await encryption.generateSecretKey()

    await expect(encryption.decrypt({
      ciphertext: "",
      iv: "",
      tag: ""
    }, secret)).rejects.toBeTruthy()
  })

  it('JWEDecrypt_invalid_change_encrypt', async () => {
    const encryption: EncryptionClient = new JWEClient()
    const secret = await encryption.generateSecretKey()
    let encrypt = await encryption.encrypt(payload, secret)
    encrypt.ciphertext = "ccmdC60irytZq2s"

    await expect(encryption.decrypt(encrypt, secret)).rejects.toBeTruthy()
  })
})