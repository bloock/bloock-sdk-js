import axios from 'axios';
import Hash from "../utils/hash";
import { API_URL } from '../utils/constants';

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

    public static async getProof(data: Hash): Promise<string[]> {
        const postmsg = {
            hash: data.getHash()
        };

        const options = {
            headers: {
                Authorization: 'Bearer ' + this.apiKey
            }
        }
    
        try {
            const res = await axios.post(`${API_URL}/verify`, postmsg);
    
            const jres = await res.data;
    
            return jres.proof;
        } catch (error) {
            throw new Error("Proof could not be generated: " + error);
        }
    }
}
