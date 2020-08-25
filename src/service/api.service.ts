import axios from 'axios';
import Hash from '../entity/hash';
import Proof from '../entity/proof';
import Message from '../entity/message';
import ConfigService from './config.service';

export default class ApiService {
    public static apiKey: string;

    public static async write(data: string[]): Promise<boolean> {
        const postmsg = {
            hashes: data,
        };

        const options = {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        };

        try {
            const res = await axios.post(
                `${ConfigService.getConfig().HOST}${ConfigService.getConfig().WRITE_ENDPOINT}`,
                postmsg,
                options,
            );

            const data = res.data;

            if (data) return true;
            return false;
        } catch (error) {
            return Promise.reject('Error writing messages: ' + error);
        }
    }

    public static async getProof(leaves: Hash[]): Promise<Proof> {
        const postmsg = {
            hashes: leaves.map(leaf => leaf.getHash()),
        };

        const options = {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        };

        try {
            const res = await axios.post(
                `${ConfigService.getConfig().HOST}${ConfigService.getConfig().PROOF_ENDPOINT}`,
                postmsg,
                options,
            );

            const data = res.data;

            return new Proof(leaves, data.nodes, data.depth, data.bitmap, data.root);
        } catch (error) {
            throw new Error('Proof could not be generated: ' + error);
        }
    }

    public static async getMessages(hashes: Hash[]): Promise<Message[]> {
        const body = {
            hashes: hashes.map(hash => hash.getHash()),
        };

        const options = {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        };

        try {
            const res = await axios.post(
                `${ConfigService.getConfig().HOST}${ConfigService.getConfig().FETCH_ENDPOINT}`,
                body,
                options,
            );
            if (res && res.data) {
                return res.data.map((item: any) => new Message(item));
            }
            return [];
        } catch (error) {
            throw new Error('Messages could not be retrieved: ' + error);
        }
    }
}
