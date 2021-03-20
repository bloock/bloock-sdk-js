export class Network {
    public name: String;
    public state: String;
    public txHash: String;

    constructor(
        name: string,
        state: string,
        txHash: string
    ) {
        this.name = name;
        this.state = state;
        this.txHash = txHash;
    }
}