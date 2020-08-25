import Hash from './entity/hash';
import Writer from './writer';
import Verifier from './verifier';
import ApiService from './service/api.service';
import Proof from './entity/proof';
import Message from './entity/message';
import { Web3Service } from '.';
import ConfigService from './service/config.service';

export default class EnchainteClient {
    private configService: ConfigService;
    private ready: Promise<any>;

    constructor(apiKey: string) {
        ApiService.apiKey = apiKey;
        this.configService = new ConfigService();

        this.ready = this.configService.onReady();
    }

    public onReady(): Promise<any> {
        return this.ready;
    }

    public setTestEnvironment(isTest: boolean): void {
        this.configService.setTestEnvironment(isTest);
    }

    public write(hash: Hash | unknown): Promise<boolean> {
        if (!Hash.isValid(hash)) {
            return Promise.reject('Invalid hash');
        }
        const subscription = Writer.getInstance();
        return subscription.push(hash as Hash);
    }

    public async getProof(hashes: Hash[] | unknown): Promise<Proof> {
        if (!hashes || !Array.isArray(hashes) || !hashes.every(hash => hash instanceof Hash)) {
            return Promise.reject('Invalid hash');
        }

        const _hashes = Hash.sort(hashes as Hash[]);
        return ApiService.getProof(_hashes);
    }

    public verify(proof: Proof | unknown): Promise<boolean> {
        if (!Proof.isValid(proof)) {
            return Promise.resolve(false);
        }

        try {
            const _proof = proof as Proof;
            const valid = Verifier.verify(_proof);
            if (!valid) {
                return Promise.resolve(false);
            }
            return Web3Service.validateRoot(_proof.root);
        } catch (err) {
            console.error(err);
            return Promise.resolve(false);
        }
    }

    public async getMessages(hashes: Hash[] | unknown): Promise<Message[]> {
        if (!hashes || !Array.isArray(hashes) || !hashes.every(hash => hash instanceof Hash)) {
            return Promise.reject('Invalid hash');
        }
        return ApiService.getMessages(hashes as Hash[]);
    }
}
