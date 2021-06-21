import { inject, injectable } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { HttpClient } from '../../infrastructure/http.client'
import { MessageRetrieveRequest } from '../entity/dto/message-retrieve-request.entity'
import { MessageRetrieveResponse } from '../entity/dto/message-retrieve-response.entity'
import { MessageWriteRequest } from '../entity/dto/message-write-request.entity'
import { MessageWriteResponse } from '../entity/dto/message-write-response.entity'
import { Message } from '../entity/message.entity'
import { MessageRepository } from './message.repository'

@injectable()
export class MessageRepositoryImpl implements MessageRepository {
  constructor(
    @inject('HttpClient') private httpClient: HttpClient,
    @inject('ConfigService') private configService: ConfigService
  ) {}

  sendMessages(messages: Message[]): Promise<MessageWriteResponse> {
    let url = `${this.configService.getApiBaseUrl()}/core/messages`
    let body = new MessageWriteRequest(messages.map((messages) => messages.getHash()))
    return this.httpClient.post(url, body)
  }
  fetchMessages(messages: Message[]): Promise<MessageRetrieveResponse[]> {
    let url = `${this.configService.getApiBaseUrl()}/core/messages/fetch`
    let body = new MessageRetrieveRequest(messages.map((messages) => messages.getHash()))
    return this.httpClient.post(url, body)
  }
}
