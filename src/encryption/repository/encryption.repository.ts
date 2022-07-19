import { TypedArray } from "../../shared/utils"
import { EncryptData } from "../entity/encrypt_data"


export interface EncryptionRepository {
  encrypt(data: TypedArray, secret: string): Promise<EncryptData>
  decrypt(encrypt_data: EncryptData, secret: string): Promise<TypedArray>
  generateSecretKey(): Promise<string>
}