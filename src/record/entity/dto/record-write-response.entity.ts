export class RecordWriteResponse {
  public anchor: number
  public client: string
  public records: string[]
  public status: string

  constructor(data: { anchor: number; client: string; records: string[]; status: string }) {
    this.anchor = data.anchor || 0
    this.client = data.client || ''
    this.records = data.records || []
    this.status = data.status || 'Pending'
  }
}
