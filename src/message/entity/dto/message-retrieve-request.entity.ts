export class MessageRetrieveRequest {
    public messages: string[]

    constructor(messages: string[]) {
        this.messages = messages;
    }
}