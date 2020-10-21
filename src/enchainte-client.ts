import Message from './entity/message';
import Writer from './writer';
import Verifier from './verifier';
import ApiService from './service/api.service';
import Proof from './entity/proof';
import MessageReceipt from './entity/message-receipt';
import { Web3Service } from '.';
import ConfigService from './service/config.service';
import Utils from './utils/utils';

export default class EnchainteClient {
    private configService: ConfigService;
    private ready: Promise<void>;

    constructor(apiKey: string) {
        ApiService.apiKey = apiKey;
        this.configService = new ConfigService();

        this.ready = this.configService.onReady();
    }

    public onReady(): Promise<void> {
        return this.ready;
    }

    public setTestEnvironment(isTest: boolean): void {
        this.configService.setTestEnvironment(isTest);
    }

    public sendMessage(message: Message | unknown): Promise<boolean> {
        if (!Message.isValid(message)) {
            return Promise.reject('Invalid message');
        }
        const subscription = Writer.getInstance();
        return subscription.push(message as Message);
    }

    public async getMessages(messages: Message[] | unknown): Promise<MessageReceipt[]> {
        if (!messages || !Array.isArray(messages) || !messages.every(message => message instanceof Message)) {
            return Promise.reject('Invalid message');
        }
        return ApiService.getMessages(messages as Message[]);
    }

    public async waitMessageReceipts(messages: Message[] | unknown): Promise<MessageReceipt[]> {
        if (!messages || !Array.isArray(messages) || !messages.every(message => message instanceof Message)) {
            return Promise.reject('Invalid message');
        }

        let completed = false;
        let attempts = 0;
        let messageReceipts: MessageReceipt[];

        do {
            messageReceipts = await this.getMessages(messages);
            completed = messageReceipts.every(receipt => receipt.status === 'success' || receipt.status === 'error');

            if (completed) break;

            await Utils.sleep(
                ConfigService.getConfig().WAIT_MESSAGE_INTERVAL_DEFAULT +
                    attempts * ConfigService.getConfig().WAIT_MESSAGE_INTERVAL_FACTOR,
            );
            attempts += 1;
        } while (!completed);

        return Promise.resolve(messageReceipts);
    }

    public async getProof(messages: Message[] | unknown): Promise<Proof> {
        if (!messages || !Array.isArray(messages) || !messages.every(message => message instanceof Message)) {
            return Promise.reject('Invalid message');
        }

        const _messages = Message.sort(messages as Message[]);
        return ApiService.getProof(_messages);
    }

    public async verifyProof(proof: Proof | unknown): Promise<boolean> {
        if (!Proof.isValid(proof)) {
            return Promise.resolve(false);
        }

        try {
            const _proof = proof as Proof;
            const root = Verifier.verify(_proof);
            return await Web3Service.validateRoot(root.getHash());
        } catch (err) {
            console.error(err);
            return Promise.resolve(false);
        }
    }

    public async verifyMessages(messages: Message[] | unknown): Promise<boolean> {
        const proof = await this.getProof(messages);
        return await this.verifyProof(proof);
    }
}
