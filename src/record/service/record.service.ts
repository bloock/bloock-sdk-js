import { RecordReceipt } from '../entity/record-receipt.entity'
import { Record } from '../entity/record.entity'

export interface RecordService {
  sendRecords(records: Record[]): Promise<RecordReceipt[]>
  getRecords(records: Record[]): Promise<RecordReceipt[]>
}
