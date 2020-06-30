import Hash from './utils/hash';
import Writer from './write/writer';
import Verifier from './verify/verifier';
import ApiService from './comms/api.service';
import Utils from './utils/utils';
import Proof from './verify/proof';
import Message from './utils/message';

class EnchainteClient {

    constructor(apiKey: string) {
        ApiService.apiKey = apiKey;
    }

    public write(hash: Hash) {
        const subscription = Writer.getInstance();
        return subscription.push(hash);
    }

    public verify(proof: Proof): boolean {
        let parsedLeaves = proof.leaves.map(leaf => leaf.getUint8ArrayHash())
        let parsedNodes = proof.nodes.map(node => Utils.hexToBytes(node))
        let parsedDepth = Utils.hexToBytes(proof.depth)
        let parsedBitmap = Utils.hexToBytes(proof.bitmap)
        return Verifier.verify(parsedLeaves, parsedNodes, parsedDepth, parsedBitmap);
    }

    public async getProof(data: Hash[]): Promise<Proof> {
        let sortedData = data.sort((a: Hash, b: Hash) => {
            let first = a.getHash().toUpperCase();
            let second = b.getHash().toUpperCase();
            return (first < second) ? -1 : (first > second) ? 1 : 0;
        })
        return ApiService.getProof(sortedData);
    }

    public async getMessage(hash: Hash): Promise<Message> {
        return ApiService.getMessage(hash);
    }
}

export default EnchainteClient;