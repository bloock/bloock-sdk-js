import Hash from '../utils/hash';
import Deferred from '../utils/deferred';
import { API_URL } from '../utils/constants';
import axios from 'axios';
import ApiService from '../comms/api.service';

class Writer {
    private static instance: Writer;

    private tasks: Map<Hash, Deferred> = new Map();

    private constructor() {
        setInterval(async () => {
            await this.send()
        }, 1000);
    }

    public push(hash: Hash): Promise<any> {
        const deferred = new Deferred();

        this.tasks.set(hash, deferred);

        return deferred.getPromise();
    }

    private async send() {
        if (!this.tasks.size) {
            return;
        }

        const currentTasks = new Map<Hash, Deferred>(this.tasks);

        this.tasks.clear();

        let dataToSend: string[] = [];

        currentTasks.forEach((deferred: Deferred, hash: Hash) => {
            dataToSend.push(hash.getHash());
        });

        try {
            await ApiService.write(dataToSend)
    
            currentTasks.forEach((deferred: Deferred) => {
                deferred.resolve(true);
            })
        } catch (error) {
            currentTasks.forEach((deferred: Deferred) => {
                deferred.reject(false);
            })
        }
    }

    public static getInstance(): Writer {
        if (!Writer.instance) {
            Writer.instance = new Writer();
        }

        return Writer.instance;
    }
}

export default Writer;