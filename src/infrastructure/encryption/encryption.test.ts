import { ConfigData } from "../../config/repository/config-data"
import { stringToBytes, TypedArray } from "../../shared/utils"
import { EncryptionClient } from "../encryption.client"
import { JWEClient } from "./jwe"



describe('Encryption jwe tests', () => {
  const payload: TypedArray = stringToBytes('hello world')
  const configData: ConfigData = new ConfigData()

  it('JWEEncrypt_valid_secret', async () => {
    const encryption: EncryptionClient = new JWEClient()
    const secret = await encryption.generateSecretKey()
    let encrypt = await encryption.encrypt(payload, secret)

    expect(encrypt).toBeTruthy()
    expect(encrypt.encrypted_key).toBeTruthy()
    expect(encrypt.header?.alg).toEqual(configData.config.SECRET_KEY_ALGORITHM)
    });

  it('JWEEncrypt_invalid_secret', async () => {
    const encryption: EncryptionClient = new JWEClient()

    await expect(encryption.encrypt(payload, 'invalidSecret')).rejects.toBeTruthy()
  })

})