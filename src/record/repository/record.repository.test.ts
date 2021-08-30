import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { HttpClient } from '../../infrastructure/http.client'
import { RecordRetrieveResponse } from '../entity/dto/record-retrieve-response.entity'
import { RecordWriteResponse } from '../entity/dto/record-write-response.entity'
import { RecordRepositoryImpl } from './record-impl.repository'
import { RecordRepository } from './record.repository'

describe('Record Repository Tests', () => {
  let configServiceMock: MockProxy<ConfigService>
  let httpClientMock: MockProxy<HttpClient>

  beforeEach(() => {
    configServiceMock = mock<ConfigService>()
    httpClientMock = mock<HttpClient>()

    container.registerInstance('ConfigService', configServiceMock)
    container.registerInstance('HttpClient', httpClientMock)
    container.register('RecordRepository', {
      useClass: RecordRepositoryImpl
    })
  })

  it('test_send_records_okay', async () => {
    httpClientMock.post.mockResolvedValueOnce(
      new RecordWriteResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        records: ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
        status: 'Pending'
      })
    )

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let recordRepository = container.resolve<RecordRepository>('RecordRepository')
    let response = await recordRepository.sendRecords([])

    expect(response).toBeInstanceOf(RecordWriteResponse)
    expect(response.anchor).toEqual(80)
    expect(response.client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(response.records).toEqual([
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    ])
    expect(response.status).toEqual('Pending')
  })

  it('test_send_records_okay_but_empty_fields', async () => {
    httpClientMock.post.mockResolvedValueOnce(new RecordWriteResponse({} as any))

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let recordRepository = container.resolve<RecordRepository>('RecordRepository')
    let response = await recordRepository.sendRecords([])

    expect(response).toBeInstanceOf(RecordWriteResponse)
    expect(response.anchor).toEqual(0)
    expect(response.client).toEqual('')
    expect(response.records).toEqual([])
    expect(response.status).toEqual('Pending')
  })

  it('test_fetch_records_okay', async () => {
    httpClientMock.post.mockResolvedValueOnce([
      new RecordRetrieveResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        record: '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5',
        status: 'Pending'
      })
    ])

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let recordRepository = container.resolve<RecordRepository>('RecordRepository')
    let response = await recordRepository.fetchRecords([])

    expect(response[0]).toBeInstanceOf(RecordRetrieveResponse)
    expect(response[0].anchor).toEqual(80)
    expect(response[0].client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(response[0].record).toEqual(
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    )
    expect(response[0].status).toEqual('Pending')
  })

  it('test_fetch_records_okay_but_empty_fields', async () => {
    httpClientMock.post.mockResolvedValueOnce([new RecordRetrieveResponse({} as any)])

    configServiceMock.getApiBaseUrl.mockReturnValueOnce('api url')

    let recordRepository = container.resolve<RecordRepository>('RecordRepository')
    let response = await recordRepository.fetchRecords([])

    expect(response[0]).toBeInstanceOf(RecordRetrieveResponse)
    expect(response[0].anchor).toEqual(0)
    expect(response[0].client).toEqual('')
    expect(response[0].record).toEqual('')
    expect(response[0].status).toEqual('Pending')
  })
})
