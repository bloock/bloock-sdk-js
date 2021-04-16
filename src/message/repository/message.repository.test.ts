import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { HttpClient } from '../../infrastructure/http.client'
import { MessageRetrieveResponse } from '../entity/dto/message-retrieve-response.entity'
import { MessageWriteResponse } from '../entity/dto/message-write-response.entity'
import { MessageRepositoryImpl } from './message-impl.repository'
import { MessageRepository } from './message.repository'

describe('Message Repository Tests', () => {
  let configServiceMock: MockProxy<ConfigService>
  let httpClientMock: MockProxy<HttpClient>

  beforeEach(() => {
    configServiceMock = mock<ConfigService>()
    httpClientMock = mock<HttpClient>()

    container.registerInstance('ConfigService', configServiceMock)
    container.registerInstance('HttpClient', httpClientMock)
    container.register('MessageRepository', {
      useClass: MessageRepositoryImpl
    })
  })

  it('test_send_messages_okay', async () => {
    httpClientMock.post.mockResolvedValueOnce(
      new MessageWriteResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        messages: ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
        status: 'Pending'
      })
    )

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let messageRepository = container.resolve<MessageRepository>('MessageRepository')
    let response = await messageRepository.sendMessages([])

    expect(response).toBeInstanceOf(MessageWriteResponse)
    expect(response.anchor).toEqual(80)
    expect(response.client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(response.messages).toEqual([
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    ])
    expect(response.status).toEqual('Pending')
  })

  it('test_send_messages_okay_but_empty_fields', async () => {
    httpClientMock.post.mockResolvedValueOnce(new MessageWriteResponse({} as any))

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let messageRepository = container.resolve<MessageRepository>('MessageRepository')
    let response = await messageRepository.sendMessages([])

    expect(response).toBeInstanceOf(MessageWriteResponse)
    expect(response.anchor).toEqual(0)
    expect(response.client).toEqual('')
    expect(response.messages).toEqual([])
    expect(response.status).toEqual('Pending')
  })

  it('test_fetch_messages_okay', async () => {
    httpClientMock.post.mockResolvedValueOnce([
      new MessageRetrieveResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        message: '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5',
        status: 'Pending'
      })
    ])

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let messageRepository = container.resolve<MessageRepository>('MessageRepository')
    let response = await messageRepository.fetchMessages([])

    expect(response[0]).toBeInstanceOf(MessageRetrieveResponse)
    expect(response[0].anchor).toEqual(80)
    expect(response[0].client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(response[0].message).toEqual(
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    )
    expect(response[0].status).toEqual('Pending')
  })

  it('test_fetch_messages_okay_but_empty_fields', async () => {
    httpClientMock.post.mockResolvedValueOnce([new MessageRetrieveResponse({} as any)])

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let messageRepository = container.resolve<MessageRepository>('MessageRepository')
    let response = await messageRepository.fetchMessages([])

    expect(response[0]).toBeInstanceOf(MessageRetrieveResponse)
    expect(response[0].anchor).toEqual(0)
    expect(response[0].client).toEqual('')
    expect(response[0].message).toEqual('')
    expect(response[0].status).toEqual('Pending')
  })
})
