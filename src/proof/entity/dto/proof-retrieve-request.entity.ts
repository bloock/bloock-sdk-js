export class ProofRetrieveRequest {
    public messages: string[]

    constructor(messages: string[]) {
        this.messages = messages;
    }
}