import Hash from './entity/hash';
import Writer from './writer';
import Verifier from './verifier';
import ApiService from './comms/api.service';
import Utils from './utils/utils';
import Proof from './entity/proof';
import Message from './entity/message';

export default class EnchainteClient {
    constructor(apiKey: string) {
        ApiService.apiKey = apiKey;
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

    public verify(proof: Proof | unknown): boolean {
        if (!Proof.isValid(proof)) {
            return false;
        }

        const _proof = proof as Proof;
        const parsedLeaves = _proof.leaves.map(leaf => leaf.getUint8ArrayHash());
        const parsedNodes = _proof.nodes.map(node => Utils.hexToBytes(node));
        const parsedDepth = Utils.hexToBytes(_proof.depth);
        const parsedBitmap = Utils.hexToBytes(_proof.bitmap);
        return Verifier.verify(parsedLeaves, parsedNodes, parsedDepth, parsedBitmap);
    }

    public async getMessages(hashes: Hash[] | unknown): Promise<Message[]> {
        if (!hashes || !Array.isArray(hashes) || !hashes.every(hash => hash instanceof Hash)) {
            return Promise.reject('Invalid hash');
        }
        return ApiService.getMessages(hashes as Hash[]);
    }
}
