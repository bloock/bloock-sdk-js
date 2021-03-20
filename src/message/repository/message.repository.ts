import { Message } from "../entity/message.entity";
import { MessageRetrieveResponse } from "../entity/dto/message-retrieve-response.entity";
import { MessageWriteResponse } from "../entity/dto/message-write-response.entity";

export interface MessageRepository {
    sendMessages(messages: Message[]): Promise<MessageWriteResponse>;
    fetchMessages(messages: Message[]): Promise<MessageRetrieveResponse[]>;
}