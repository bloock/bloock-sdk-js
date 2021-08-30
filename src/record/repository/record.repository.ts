import { RecordRetrieveResponse } from '../entity/dto/record-retrieve-response.entity'
import { RecordWriteResponse } from '../entity/dto/record-write-response.entity'
import { Record } from '../entity/record.entity'

export interface RecordRepository {
  sendRecords(records: Record[]): Promise<RecordWriteResponse>
  fetchRecords(records: Record[]): Promise<RecordRetrieveResponse[]>
}
