import axios from 'axios';
import Message from '../entity/message';
import Proof from '../entity/proof';
import MessageReceipt from '../entity/message-receipt';
import ConfigService from './config.service';

export default class ApiService {
    public static apiKey: string;

    public static async write(messages: Message[]): Promise<boolean> {
        const body = {
            hashes: messages.map(message => message.getHash()),
        };

        const options = {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        };

        try {
            const res = await axios.post(
                `${ConfigService.getConfig().HOST}${ConfigService.getConfig().WRITE_ENDPOINT}`,
                body,
                options,
            );

            const data = res.data;

            if (data) return true;
            return false;
        } catch (error) {
            return Promise.reject('Error writing messages: ' + error);
        }
    }

    public static async getProof(messages: Message[]): Promise<Proof> {
        const body = {
            hashes: messages.map(message => message.getHash()),
        };

        const options = {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        };

        try {
            const res = await axios.post(
                `${ConfigService.getConfig().HOST}${ConfigService.getConfig().PROOF_ENDPOINT}`,
                body,
                options,
            );

            const data = res.data;

            return new Proof(messages, data.nodes, data.depth, data.bitmap, data.root);
        } catch (error) {
            throw new Error('Proof could not be generated: ' + error);
        }
    }

    public static async getMessages(messages: Message[]): Promise<MessageReceipt[]> {
        const body = {
            hashes: messages.map(message => message.getHash()),
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
                return res.data.map((item: any) => new MessageReceipt(item));
            }
            return [];
        } catch (error) {
            throw new Error('Messages could not be retrieved: ' + error);
        }
    }
}
