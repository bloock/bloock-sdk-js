import Hash from './utils/hash';
import Writer from './write/writer';
import Verifier from './verify/verifier';
import ApiService from './comms/api.service';

class EnchainteClient {

    constructor(apiKey: string) {
        ApiService.apiKey = apiKey;
    }

    public write(hash: Hash) {
        const subscription = Writer.getInstance();
        return subscription.push(hash);
    }

    public verify(proof: string[]): Promise<boolean> {
        return Verifier.verify(proof);
    }

    public async getProof(data: Hash): Promise<string[]> {
        return ApiService.getProof(data);
    }
}

export default EnchainteClient;