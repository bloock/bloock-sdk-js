import axios from 'axios';
import Hash from "../utils/hash";
import { API_URL } from '../utils/constants';
import Proof from '../verify/proof';
import Message from '../utils/message';

export default class ApiService {

    public static apiKey: string;

    public static async write(data: string[]) {
        const postmsg = {
            hashes: data
        };

        const options = {
            headers: {
                Authorization: 'Bearer ' + this.apiKey
            }
        }
            
        return await axios.post(`${API_URL}/write`, postmsg, options);
    }

    public static async getProof(leaves: Hash[]): Promise<Proof> {
        const postmsg = {
            hashes: leaves.map(leaf => leaf.getHash())
        };

        const options = {
            headers: {
                Authorization: 'Bearer ' + this.apiKey
            }
        }
    
        try {
            const res = await axios.post(`${API_URL}/proof`, postmsg, options);
    
            const data = res.data;
    
            return new Proof(
                leaves,
                data.nodes,
                data.depth,
                data.bitmap,
            );
        } catch (error) {
            throw new Error("Proof could not be generated: " + error);
        }
    }

    public static async getMessage(hash: Hash): Promise<Message> {
        const options = {
            headers: {
                Authorization: 'Bearer ' + this.apiKey
            }
        }
    
        try {
            const res = await axios.get(`${API_URL}/message/${hash.getHash()}`, options);
    
            return new Message(res.data);
        } catch (error) {
            throw new Error("Root could not be retrieved: " + error);
        }
    }
}
