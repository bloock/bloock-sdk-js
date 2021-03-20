import { MessageReceipt } from "../entity/message-receipt.entity";
import { Message } from "../entity/message.entity";

export interface MessageService {
    sendMessages(messages: Message[]): Promise<MessageReceipt[]>
    getMessages(messages: Message[]): Promise<MessageReceipt[]>
}