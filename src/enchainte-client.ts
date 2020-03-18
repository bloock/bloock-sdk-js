import Hash from './hash';
import { API_URL, SMT_URL } from './constants';
import axios from 'axios';
import WriteSubscription from './write-subscription';
import Verifier from './verifier';

class EnchainteClient {

    public write(hash: Hash) {
        const subscription = WriteSubscription.getInstance();
        return subscription.push(hash);
    }

    public verify(proof: string[]): boolean {
        return Verifier.verify(proof);
    }

    public async getProof(data: Hash): Promise<string[]> {
        const postmsg = {
            hash: data.getHash()
        };

        try {
            const res = await axios.post(`${SMT_URL}/proof`, postmsg);

            const jres = await res.data;

            return jres.proof;
        } catch (error) {
            throw new Error("Proof could not be generated");
        }
    }
}

export default EnchainteClient;