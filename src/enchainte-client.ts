import { container } from "tsyringe";
import { Anchor } from "./anchor/entity/anchor.entity";

import { AnchorService } from './anchor/service/anchor.service';
import { ConfigEnv } from './config/entity/config-env.entity';
import { ConfigService } from './config/service/config.service';
import { HttpClient } from './infrastructure/http.client';
import { MessageReceipt } from "./message/entity/message-receipt.entity";
import { Message } from "./message/entity/message.entity";
import { MessageService } from './message/service/message.service';
import { Proof } from "./proof/entity/proof.entity";
import { ProofService } from './proof/service/proof.service';
import { DependencyInjection } from './shared/dependency-injection';

export class EnchainteClient {
    private anchorService: AnchorService;
    private configService: ConfigService;
    private messageService: MessageService;
    private proofService: ProofService;

    private httpClient: HttpClient;

    constructor(apiKey: string, environment: ConfigEnv = ConfigEnv.TEST) {
        DependencyInjection.setUp();

        this.anchorService = container.resolve<AnchorService>("AnchorService");
        this.configService = container.resolve<ConfigService>("ConfigService");
        this.messageService = container.resolve<MessageService>("MessageService");
        this.proofService = container.resolve<ProofService>("ProofService");

        this.httpClient = container.resolve<HttpClient>("HttpClient");

        this.httpClient.setApiKey(apiKey);
        this.configService.setupEnvironment(environment);
    }

    public async sendMessages(messages: Message[]): Promise<MessageReceipt[]> {
        return this.messageService.sendMessages(messages);
    }

    public async getMessages(messages: Message[]): Promise<MessageReceipt[]> {
        return this.messageService.getMessages(messages);
    }

    public async getAnchor(anchor: number): Promise<Anchor> {
        return this.anchorService.getAnchor(anchor);
    }

    public async waitAnchor(anchor: number): Promise<Anchor> {
        return this.anchorService.waitAnchor(anchor);
    }

    public async getProof(messages: Message[]): Promise<Proof> {
        return this.proofService.retrieveProof(messages);
    }

    public async verifyProof(proof: Proof): Promise<boolean> {
        return this.proofService.verifyProof(proof)
    }

    public async verifyMessages(messages: Message[]): Promise<boolean> {
        return this.proofService.verifyMessages(messages);
    }
}
