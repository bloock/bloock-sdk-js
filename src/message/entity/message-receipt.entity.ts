export class MessageReceipt {
    public anchor: number;
    public client: string;
    public message: string;
    public status: string;

    constructor(
        anchor: number,
        client: string,
        message: string,
        status: string
    ) {
        this.anchor = anchor;
        this.client = client;
        this.message = message;
        this.status = status;
    }
}
