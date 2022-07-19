import { container } from 'tsyringe';
import { EncryptData } from './encryption/entity/encrypt_data';
import { EncryptionService } from "./encryption/service/encryption.service";
import { HttpClient } from './infrastructure/http.client';
import { DependencyInjection } from "./shared/dependency-injection";
import { TypedArray } from './shared/utils';


export class BloockEncryptionClient {
  private encryptionService: EncryptionService
  private httpClient: HttpClient

  constructor(apiKey: string) {
    DependencyInjection.setUp()

    this.encryptionService = container.resolve<EncryptionService>('EncryptionService')
    this.httpClient = container.resolve<HttpClient>('HttpClient')
    this.httpClient.setApiKey(apiKey)
  }

  public async generateSecretKey(): Promise<string> {
    return this.encryptionService.generateSecretKey()
  }

  public async encryptData(data: TypedArray, secret: string): Promise<EncryptData> {
    return this.encryptionService.encrypt(data, secret)
  }

  public async decryptData(encrypt_data: EncryptData, secret: string): Promise<TypedArray> {
    return this.encryptionService.decrypt(encrypt_data, secret)
  }
}