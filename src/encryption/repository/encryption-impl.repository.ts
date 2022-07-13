import { inject, injectable } from "tsyringe"
import { EncryptionClient } from "../../infrastructure/encryption.client"
import { TypedArray } from "../../shared/utils"
import { EncryptData } from "../entity/encrypt_data"
import { EncryptionRepository } from "./encryption.repository"

@injectable()
export class EncryptionRepositoryImpl implements EncryptionRepository {
  constructor(
    @inject('EncryptionClient') private encryptionClient: EncryptionClient,
  ) {}

  async encrypt(data: TypedArray, secret: string): Promise<EncryptData> {
    const ed = await this.encryptionClient.encrypt(data, secret)
    return new EncryptData(ed.ciphertext, ed.iv, ed.tag, ed.protect, ed.encrypted_key, ed.header)
  }

  async decrypt(encrypt_data: EncryptData, secret: string): Promise<TypedArray> {
    const dd = await this.encryptionClient.decrypt(encrypt_data, secret)
    return dd
  }

  async generateSecretKey(): Promise<string> {
    const k = await this.encryptionClient.generateSecretKey()
    return k
  }
}