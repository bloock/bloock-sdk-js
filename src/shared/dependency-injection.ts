import { container } from "tsyringe";
import { AnchorRepositoryImpl } from "../anchor/repository/anchor-impl.repository";
import { AnchorServiceImpl } from "../anchor/service/anchor-impl.service";
import { ConfigData } from "../config/repository/config-data";
import { ConfigRepositoryImpl } from "../config/repository/config-impl.repository";
import { ConfigServiceImpl } from "../config/service/config-impl.service";
import { Web3Client } from "../infrastructure/blockchain/web3";
import { Keccak } from "../infrastructure/hashing/keccak";
import { HttpData } from "../infrastructure/http/http-data";
import { HttpClientImpl } from "../infrastructure/http/http-impl";
import { MessageRepositoryImpl } from "../message/repository/message-impl.repository";
import { MessageServiceImpl } from "../message/service/message-impl.service";
import { ProofRepositoryImpl } from "../proof/repository/proof-impl.repository";
import { ProofServiceImpl } from "../proof/service/proof-impl.service";

export class DependencyInjection {
    public static setUp() {
        // Infrastructure module
        container.register("BlockchainClient", {
            useClass: Web3Client
        });
        container.registerSingleton("HttpData", HttpData);

        container.register("HttpClient", {
            useClass: HttpClientImpl
        });
        container.register("HashingClient", {
            useClass: Keccak
        });

        // Anchor module
        container.register("AnchorRepository", {
            useClass: AnchorRepositoryImpl
        });
        container.register("AnchorService", {
            useClass: AnchorServiceImpl
        });

        // Config module
        container.registerSingleton("ConfigData", ConfigData);
        container.register("ConfigRepository", {
            useClass: ConfigRepositoryImpl
        });
        container.register("ConfigService", {
            useClass: ConfigServiceImpl
        });

        // Message module
        container.register("MessageRepository", {
            useClass: MessageRepositoryImpl
        });
        container.register("MessageService", {
            useClass: MessageServiceImpl
        });

        // Proof module
        container.register("ProofRepository", {
            useClass: ProofRepositoryImpl
        });
        container.register("ProofService", {
            useClass: ProofServiceImpl
        });

    }
}