export class InvalidMessageException implements Error {
    name: string = "InvalidMessageException";
    message: string = "Message not valid";
    stack?: string | undefined;
}