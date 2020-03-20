import axios from 'axios';
import Hash from "../utils/hash";
import { SMT_URL } from '../utils/constants';

export default class ApiService {
    public static async getProof(data: Hash): Promise<string[]> {
        const postmsg = {
            hash: data.getHash()
        };
    
        try {
            const res = await axios.get(`${SMT_URL}/proof`, {
                params: {
                  ...postmsg
                }
              });
    
            const jres = await res.data;
    
            return jres.proof;
        } catch (error) {
            throw new Error("Proof could not be generated: " + error);
        }
    }
}
