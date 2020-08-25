import Hash from './entity/hash';
import Deferred from './utils/deferred';
import ApiService from './service/api.service';
import Config from './entity/config';
import ConfigService from './service/config.service';

export default class Writer {
    private static instance: Writer;
    public static config: Config;

    private tasks: Map<Hash, Deferred> = new Map();

    private constructor() {
        this.setUp();
    }

    private setUp() {
        setInterval(async () => {
            await this.send();
        }, parseInt(ConfigService.getConfig().WRITE_INTERVAL));
    }

    public push(hash: Hash): Promise<boolean> {
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

        const dataToSend: string[] = [];

        currentTasks.forEach((_deferred: Deferred, hash: Hash) => {
            dataToSend.push(hash.getHash());
        });

        try {
            await ApiService.write(dataToSend);

            currentTasks.forEach((deferred: Deferred) => {
                deferred.resolve(true);
            });
        } catch (error) {
            currentTasks.forEach((deferred: Deferred) => {
                deferred.reject(error);
            });
        }
    }

    public static getInstance(): Writer {
        if (!Writer.instance) {
            Writer.instance = new Writer();
        }

        return Writer.instance;
    }
}
