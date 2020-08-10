export default class Deferred {
    public promise: Promise<boolean>;
    public reject!: (result: boolean) => void;
    public resolve!: (result: boolean) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }

    public getPromise(): Promise<boolean> {
        return this.promise;
    }
}
