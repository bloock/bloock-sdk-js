import { container } from 'tsyringe'
import { AnchorRepositoryImpl } from '../anchor/repository/anchor-impl.repository'
import { AnchorServiceImpl } from '../anchor/service/anchor-impl.service'
import { ConfigData } from '../config/repository/config-data'
import { ConfigRepositoryImpl } from '../config/repository/config-impl.repository'
import { ConfigServiceImpl } from '../config/service/config-impl.service'
import { EncryptionRepositoryImpl } from '../encryption/repository/encryption-impl.repository'
import { EncryptionServiceImpl } from '../encryption/service/encryption-impl.service'
import { Web3Client } from '../infrastructure/blockchain/web3'
import { JWEClient } from '../infrastructure/encryption/jwe'
import { Keccak } from '../infrastructure/hashing/keccak'
import { HttpData } from '../infrastructure/http/http-data'
import { HttpClientImpl } from '../infrastructure/http/http-impl'
import { ProofRepositoryImpl } from '../proof/repository/proof-impl.repository'
import { ProofServiceImpl } from '../proof/service/proof-impl.service'
import { RecordRepositoryImpl } from '../record/repository/record-impl.repository'
import { RecordServiceImpl } from '../record/service/record-impl.service'

export class DependencyInjection {
  public static setUp() {
    // Infrastructure module
    container.register('BlockchainClient', {
      useClass: Web3Client
    })
    container.registerSingleton('HttpData', HttpData)

    container.register('HttpClient', {
      useClass: HttpClientImpl
    })
    container.register('HashingClient', {
      useClass: Keccak
    })

    // Anchor module
    container.register('AnchorRepository', {
      useClass: AnchorRepositoryImpl
    })
    container.register('AnchorService', {
      useClass: AnchorServiceImpl
    })

    // Config module
    container.registerSingleton('ConfigData', ConfigData)
    container.register('ConfigRepository', {
      useClass: ConfigRepositoryImpl
    })
    container.register('ConfigService', {
      useClass: ConfigServiceImpl
    })

    // Record module
    container.register('RecordRepository', {
      useClass: RecordRepositoryImpl
    })
    container.register('RecordService', {
      useClass: RecordServiceImpl
    })

    // Proof module
    container.register('ProofRepository', {
      useClass: ProofRepositoryImpl
    })
    container.register('ProofService', {
      useClass: ProofServiceImpl
    })

    // Encryption module
    container.register('EncryptionRepository', {
      useClass: EncryptionRepositoryImpl
    })
    container.register('EncryptionService', {
      useClass: EncryptionServiceImpl
    })
    container.register('EncryptionClient', {
      useClass: JWEClient
    })
  }
}
