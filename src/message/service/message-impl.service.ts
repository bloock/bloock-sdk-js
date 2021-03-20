import { injectable, inject } from "tsyringe";

import { InvalidMessageException } from "../entity/exception/invalid-message.exception";
import { MessageReceipt } from "../entity/message-receipt.entity";
import { Message } from "../entity/message.entity";
import { MessageRepository } from "../repository/message.repository";
import { MessageService } from "./message.service";

@injectable()
export class MessageServiceImpl implements MessageService {

    constructor(
        @inject("MessageRepository") private messageRepository: MessageRepository
    ) {}

    async sendMessages(messages: Message[]): Promise<MessageReceipt[]> {
        if (messages.length == 0) {
            return []
        }

        messages.forEach(message => {
            if (!Message.isValid(message)) {
                throw new InvalidMessageException()
            }
        })

        let response = await this.messageRepository.sendMessages(messages);

        let result: MessageReceipt[] = []
        messages.forEach(message => {
            result.push(new MessageReceipt(
                response.anchor || 0,
                response.client || "",
                message.getHash(),
                response.status || ""
            ))
        })

        return result;
    }
    async getMessages(messages: Message[]): Promise<MessageReceipt[]> {
        let response = await this.messageRepository.fetchMessages(messages);
        if (response == null) {
            return [];
        }

        return response.map(message => new MessageReceipt(
            message.anchor || 0,
            message.client || "",
            message.message || "",
            message.status || ""
        ))
    }
}