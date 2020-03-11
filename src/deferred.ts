export default class Deferred {

    public promise: Promise<any>;
    public reject: any;
    public resolve: any;

    constructor() {
      this.promise = new Promise((resolve, reject)=> {
        this.reject = reject;
        this.resolve = resolve;
      })
    }

    public getPromise(): Promise<any> {
        return this.promise;
    }
  }