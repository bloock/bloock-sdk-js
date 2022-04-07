import { inject, injectable } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { HttpClient } from '../../infrastructure/http.client'
import { RecordRetrieveRequest } from '../entity/dto/record-retrieve-request.entity'
import { RecordRetrieveResponse } from '../entity/dto/record-retrieve-response.entity'
import { RecordWriteRequest } from '../entity/dto/record-write-request.entity'
import { RecordWriteResponse } from '../entity/dto/record-write-response.entity'
import { Record } from '../entity/record.entity'
import { RecordRepository } from './record.repository'

@injectable()
export class RecordRepositoryImpl implements RecordRepository {
  constructor(
    @inject('HttpClient') private httpClient: HttpClient,
    @inject('ConfigService') private configService: ConfigService
  ) {}

  sendRecords(records: Record<any>[]): Promise<RecordWriteResponse> {
    let url = `${this.configService.getApiBaseUrl()}/core/messages`
    let body = new RecordWriteRequest(records.map((records) => records.getHash()))
    return this.httpClient.post(url, body)
  }
  fetchRecords(records: Record<any>[]): Promise<RecordRetrieveResponse[]> {
    let url = `${this.configService.getApiBaseUrl()}/core/messages/fetch`
    let body = new RecordRetrieveRequest(records.map((records) => records.getHash()))
    return this.httpClient.post(url, body)
  }
}
