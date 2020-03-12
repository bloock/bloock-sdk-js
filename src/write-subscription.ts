import Hash from './hash';
import Deferred from './deferred';
import { API_URL } from './constants';
import axios from 'axios';

class WriteSubscription {
    private static instance: WriteSubscription;

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

        const postmsg = {
            hash: dataToSend
        };

        try {
            const res = await axios.post(`${API_URL}/send`, postmsg);
    
            currentTasks.forEach((deferred: Deferred) => {
                deferred.resolve(true);
            })
        } catch (error) {
            currentTasks.forEach((deferred: Deferred) => {
                deferred.reject(false);
            })
        }
    }

    public static getInstance(): WriteSubscription {
        if (!WriteSubscription.instance) {
            WriteSubscription.instance = new WriteSubscription();
        }

        return WriteSubscription.instance;
    }
}

export default WriteSubscription;