import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { MessageRetrieveResponse } from '../entity/dto/message-retrieve-response.entity'
import { MessageWriteResponse } from '../entity/dto/message-write-response.entity'
import { InvalidMessageException } from '../entity/exception/invalid-message.exception'
import { MessageReceipt } from '../entity/message-receipt.entity'
import { Message } from '../entity/message.entity'
import { MessageRepository } from '../repository/message.repository'
import { MessageServiceImpl } from './message-impl.service'
import { MessageService } from './message.service'

describe('Message Service Tests', () => {
  let messageRepositoryMock: MockProxy<MessageRepository>

  beforeEach(() => {
    messageRepositoryMock = mock<MessageRepository>()

    container.registerInstance('MessageRepository', messageRepositoryMock)
    container.register('MessageService', {
      useClass: MessageServiceImpl
    })
  })

  it('test_send_messages_okay', async () => {
    messageRepositoryMock.sendMessages.mockResolvedValueOnce(
      new MessageWriteResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        messages: ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
        status: 'Pending'
      })
    )

    let messageService = container.resolve<MessageService>('MessageService')
    let result = await messageService.sendMessages([
      Message.fromHash('02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5')
    ])

    expect(Array.isArray(result)).toBeTruthy()
    expect(result[0]).toBeInstanceOf(MessageReceipt)
    expect(result[0].anchor).toEqual(80)
    expect(result[0].client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(result[0].message).toEqual(
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    )
    expect(result[0].status).toEqual('Pending')
  })

  it('test_send_messages_some_invalid_message_error', async () => {
    messageRepositoryMock.sendMessages.mockResolvedValueOnce(
      new MessageWriteResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        messages: [
          '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5',
          'message2',
          ''
        ],
        status: 'Pending'
      })
    )

    let messageService = container.resolve<MessageService>('MessageService')

    await expect(messageService.sendMessages([Message.fromHash('message')])).rejects.toEqual(
      new InvalidMessageException()
    )
  })

  it('test_get_messages_okay', async () => {
    messageRepositoryMock.fetchMessages.mockResolvedValueOnce([
      new MessageRetrieveResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        message: '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5',
        status: 'Pending'
      })
    ])

    let messageService = container.resolve<MessageService>('MessageService')
    let result = await messageService.getMessages([Message.fromString('message')])

    expect(result[0]).toBeInstanceOf(MessageReceipt)
    expect(result[0].anchor).toEqual(80)
    expect(result[0].client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(result[0].message).toEqual(
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    )
    expect(result[0].status).toEqual('Pending')
  })
})
