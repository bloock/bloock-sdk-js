export class MessageWriteRequest {
    public messages: string[];

    constructor(messages: string[]) {
        this.messages = messages;
    }
}