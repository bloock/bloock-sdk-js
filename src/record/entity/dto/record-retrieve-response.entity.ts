export class RecordRetrieveResponse {
  public anchor: number
  public client: string
  public record: string
  public status: string

  constructor(data: { anchor: number; client: string; record: string; status: string }) {
    this.anchor = data.anchor || 0
    this.client = data.client || ''
    this.record = data.record || ''
    this.status = data.status || 'Pending'
  }
}
