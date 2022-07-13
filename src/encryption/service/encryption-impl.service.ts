import { inject, injectable } from 'tsyringe';
import { TypedArray } from "../../shared/utils";
import { EncryptData } from "../entity/encrypt_data";
import { EncryptionRepository } from '../repository/encryption.repository';
import { EncryptionService } from "./encryption.service";

@injectable()
export class EncryptionServiceImpl implements EncryptionService {
  constructor(
    @inject('EncryptionRepository') private encryptionRepository: EncryptionRepository
  ) {}

  async encrypt(data: TypedArray, secret: string): Promise<EncryptData> {
    const ed = await this.encryptionRepository.encrypt(data, secret)
    return ed
  }

  async decrypt(encrypt_data: EncryptData, secret: string): Promise<TypedArray> {
    const dd = await this.encryptionRepository.decrypt(encrypt_data, secret)
    return dd
  }

  async generateSecretKey(): Promise<string> {
    const k = await this.encryptionRepository.generateSecretKey()
    return k
  }
}