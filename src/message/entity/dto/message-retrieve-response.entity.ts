export class MessageRetrieveResponse {
    public anchor: number;
    public client: string;
    public message: string;
    public status: string;

    constructor(data: {
        anchor: number,
        client: string,
        message: string,
        status: string
    }) {
        this.anchor = data.anchor;
        this.client = data.client;
        this.message = data.message;
        this.status = data.status;
    }
}