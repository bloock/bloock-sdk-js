import Hash from './hash';
import { API_URL } from './constants';
import axios from 'axios';
import WriteSubscription from './write-subscription';
import Verifier from './verifier';

class EnchainteClient {

    public write(hash: Hash) {
        const subscription = WriteSubscription.getInstance();
        return subscription.push(hash);
    }

    public getProof(hash: Hash) {
        return this.verify(hash.getHash());
    }

    public verifyProof(proof: Hash[]): boolean {
        return Verifier.verify(proof);
    }

    private async verify(data: string): Promise<string> {
        const postmsg = {
            hash: data
        };

        try {
            const res = await axios.post(`${API_URL}/verify`, postmsg, {
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            });

            const jres = await res.data;
            return jres.proof;
        } catch (error) {
            throw new Error("Proof could not be generated");
        }
    }
}

export default EnchainteClient;