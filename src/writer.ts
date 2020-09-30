import Message from './entity/message';
import Deferred from './utils/deferred';
import ApiService from './service/api.service';
import Config from './entity/config';
import ConfigService from './service/config.service';

export default class Writer {
    private static instance: Writer;
    public static config: Config;

    private tasks: Map<Message, Deferred> = new Map();

    private constructor() {
        this.setUp();
    }

    private setUp() {
        setInterval(async () => {
            await this.send();
        }, ConfigService.getConfig().WRITE_INTERVAL);
    }

    public push(message: Message): Promise<boolean> {
        const deferred = new Deferred();

        this.tasks.set(message, deferred);

        return deferred.getPromise();
    }

    private async send() {
        if (!this.tasks.size) {
            return;
        }

        const currentTasks = new Map<Message, Deferred>(this.tasks);

        this.tasks.clear();

        try {
            await ApiService.write(Array.from(currentTasks.keys()));

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
