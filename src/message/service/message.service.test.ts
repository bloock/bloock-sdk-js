import { container } from 'tsyringe';
import { MockProxy, mock } from 'jest-mock-extended';

import { ConfigService } from '../../config/service/config.service';
import { HttpClient} from '../../infrastructure/http.client';
import { MessageRepository } from '../repository/message.repository';
import { MessageServiceImpl } from './message-impl.service';
import { MessageService } from './message.service';
import { Message } from '../entity/message.entity';
import { MessageWriteResponse } from '../entity/dto/message-write-response.entity';
import { MessageReceipt } from '../entity/message-receipt.entity';
import { MessageRetrieveResponse } from '../entity/dto/message-retrieve-response.entity';

describe('Message Service Tests', () => {

    let configServiceMock: MockProxy<ConfigService>;
    let httpClientMock: MockProxy<HttpClient>;
    let messageRepositoryMock: MockProxy<MessageRepository>;

    beforeEach(() => {
        configServiceMock = mock<ConfigService>();
        httpClientMock = mock<HttpClient>();
        messageRepositoryMock = mock<MessageRepository>();

        container.registerInstance("ConfigService", configServiceMock);
        container.registerInstance("HttpClient", httpClientMock);
        container.registerInstance("MessageRepository", messageRepositoryMock);
        container.register("MessageService", {
            useClass: MessageServiceImpl
        });
    });

    it('should send messages', async () => {
        let messages = [
            Message.fromHash("264248bf767509da977f61d42d5723511b7af2781613b9119edcebb25a226976"),
            Message.fromHash("285f570a90110fb94d5608b25d9e2b74bb58f068d495190f469aac5ef7ecf3c5"),
        ];
        let apiResponse = new MessageWriteResponse({
            anchor: 1,
            client: "client",
            messages: messages.map(message => message.getHash()),
            status: "Pending"
        });
        let expectedResult = messages.map(message => {
            return new MessageReceipt(1, "client", message.getHash(), "Pending")
        })

        messageRepositoryMock.sendMessages
            .calledWith(messages).mockResolvedValue(apiResponse);
            
        let messageService = container.resolve<MessageService>("MessageService");
        let result = await messageService.sendMessages(messages);

        expect(result).toMatchObject(expectedResult)
    });

    it('should receive messages', async () => {
        let messages = [
            Message.fromHash("264248bf767509da977f61d42d5723511b7af2781613b9119edcebb25a226976"),
            Message.fromHash("285f570a90110fb94d5608b25d9e2b74bb58f068d495190f469aac5ef7ecf3c5"),
        ];
        let apiResponse = [
            new MessageRetrieveResponse({
                anchor: 1,
                client: "client",
                message: messages[0].getHash(),
                status: "Pending"
            }),
            new MessageRetrieveResponse({
                anchor: 1,
                client: "client",
                message: messages[1].getHash(),
                status: "Pending"
            })
        ];
        let expectedResult = messages.map(message => {
            return new MessageReceipt(1, "client", message.getHash(), "Pending")
        })

        messageRepositoryMock.fetchMessages
            .calledWith(messages).mockResolvedValue(apiResponse);
            
        let messageService = container.resolve<MessageService>("MessageService");
        let result = await messageService.getMessages(messages);

        expect(result).toMatchObject(expectedResult)
    });
});
