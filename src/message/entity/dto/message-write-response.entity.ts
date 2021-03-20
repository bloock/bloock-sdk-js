export class MessageWriteResponse {
    public anchor: number;
    public client: string;
    public messages: string[];
    public status: string;

    constructor(data: {
        anchor: number,
        client: string,
        messages: string[],
        status: string
    }) {
        this.anchor = data.anchor;
        this.client = data.client;
        this.messages = data.messages;
        this.status = data.status;
    }
}