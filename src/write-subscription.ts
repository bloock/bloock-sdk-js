import Hash from './hash';
import Deferred from './deferred';
import { API_URL } from './constants';

export default class WriteSubscription {
    private static instance: WriteSubscription;

    private tasks: Map<Hash, Deferred> = new Map();

    private constructor() {
        setInterval(() => {
            this.send().then();
        }, 1000);
    }

    public push(hash: Hash): Promise<any> {
        const deferred = new Deferred();

        this.tasks.set(hash, deferred);

        return deferred.getPromise();
    }

    private async send() {
        const currentTasks = new Map<Hash, Deferred>(this.tasks);

        this.tasks = new Map<Hash, Deferred>();

        let dataToSend: string[] = [];

        currentTasks.forEach((deferred: Deferred, hash: Hash) => {
            dataToSend.push(hash.getHash());
        });

        const postmsg = {
            hash: dataToSend
        };
        const res = await fetch(`${API_URL}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(postmsg)
        });

        currentTasks.forEach((deferred: Deferred) => {
            if (res.ok) {
                deferred.resolve(true);
            } else {
                deferred.reject(false);
            }
        })

        return res.ok;
    }

    public static getInstance(): WriteSubscription {
        if (!WriteSubscription.instance) {
            WriteSubscription.instance = new WriteSubscription();
        }

        return WriteSubscription.instance;
    }
}