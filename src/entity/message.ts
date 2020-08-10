export default class Message {
    public root: string;
    public message: string;
    public txHash: string;
    public status: string;
    public error: number;

    constructor(data: { root: string; message: string; tx_hash: string; status: string; error: number }) {
        this.root = data.root;
        this.message = data.message;
        this.txHash = data.tx_hash;
        this.status = data.status;
        this.error = data.error;
    }
}
