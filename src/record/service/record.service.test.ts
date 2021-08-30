import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { RecordRetrieveResponse } from '../entity/dto/record-retrieve-response.entity'
import { RecordWriteResponse } from '../entity/dto/record-write-response.entity'
import { InvalidRecordException } from '../entity/exception/invalid-record.exception'
import { RecordReceipt } from '../entity/record-receipt.entity'
import { Record } from '../entity/record.entity'
import { RecordRepository } from '../repository/record.repository'
import { RecordServiceImpl } from './record-impl.service'
import { RecordService } from './record.service'

describe('Record Service Tests', () => {
  let recordRepositoryMock: MockProxy<RecordRepository>

  beforeEach(() => {
    recordRepositoryMock = mock<RecordRepository>()

    container.registerInstance('RecordRepository', recordRepositoryMock)
    container.register('RecordService', {
      useClass: RecordServiceImpl
    })
  })

  it('test_send_records_okay', async () => {
    recordRepositoryMock.sendRecords.mockResolvedValueOnce(
      new RecordWriteResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        messages: ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
        status: 'Pending'
      })
    )

    let recordService = container.resolve<RecordService>('RecordService')
    let result = await recordService.sendRecords([
      Record.fromHash('02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5')
    ])

    expect(Array.isArray(result)).toBeTruthy()
    expect(result[0]).toBeInstanceOf(RecordReceipt)
    expect(result[0].anchor).toEqual(80)
    expect(result[0].client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(result[0].record).toEqual(
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    )
    expect(result[0].status).toEqual('Pending')
  })

  it('test_send_records_some_invalid_record_error', async () => {
    recordRepositoryMock.sendRecords.mockResolvedValueOnce(
      new RecordWriteResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        messages: [
          '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5',
          'record2',
          ''
        ],
        status: 'Pending'
      })
    )

    let recordService = container.resolve<RecordService>('RecordService')

    await expect(recordService.sendRecords([Record.fromHash('record')])).rejects.toEqual(
      new InvalidRecordException()
    )
  })

  it('test_get_records_okay', async () => {
    recordRepositoryMock.fetchRecords.mockResolvedValueOnce([
      new RecordRetrieveResponse({
        anchor: 80,
        client: 'ce10c769-022b-405e-8e7c-3b52eeb2a4ea',
        message: '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5',
        status: 'Pending'
      })
    ])

    let recordService = container.resolve<RecordService>('RecordService')
    let result = await recordService.getRecords([Record.fromString('record')])

    expect(result[0]).toBeInstanceOf(RecordReceipt)
    expect(result[0].anchor).toEqual(80)
    expect(result[0].client).toEqual('ce10c769-022b-405e-8e7c-3b52eeb2a4ea')
    expect(result[0].record).toEqual(
      '02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'
    )
    expect(result[0].status).toEqual('Pending')
  })
})
