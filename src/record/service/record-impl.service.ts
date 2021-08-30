import { inject, injectable } from 'tsyringe'
import { InvalidArgumentException } from '../../shared/entity/exception/invalid-argument.exception'
import { InvalidRecordException } from '../entity/exception/invalid-record.exception'
import { RecordReceipt } from '../entity/record-receipt.entity'
import { Record } from '../entity/record.entity'
import { RecordRepository } from '../repository/record.repository'
import { RecordService } from './record.service'

@injectable()
export class RecordServiceImpl implements RecordService {
  constructor(@inject('RecordRepository') private recordRepository: RecordRepository) {}

  async sendRecords(records: Record[]): Promise<RecordReceipt[]> {
    if (records.length == 0) {
      return []
    }

    if (!Array.isArray(records)) {
      throw new InvalidArgumentException()
    }

    if (!records.every((record) => Record.isValid(record))) {
      throw new InvalidRecordException()
    }

    let response = await this.recordRepository.sendRecords(records)

    let result: RecordReceipt[] = []
    records.forEach((record) => {
      result.push(
        new RecordReceipt(
          response.anchor || 0,
          response.client || '',
          record.getHash(),
          response.status || ''
        )
      )
    })

    return result
  }
  async getRecords(records: Record[]): Promise<RecordReceipt[]> {
    if (records.length == 0) return []

    if (!Array.isArray(records)) {
      throw new InvalidArgumentException()
    }

    if (!records.every((record) => Record.isValid(record))) {
      throw new InvalidRecordException()
    }

    let response = await this.recordRepository.fetchRecords(records)
    if (response == null) {
      return []
    }

    return response.map(
      (record) =>
        new RecordReceipt(
          record.anchor || 0,
          record.client || '',
          record.record || '',
          record.status || ''
        )
    )
  }
}
