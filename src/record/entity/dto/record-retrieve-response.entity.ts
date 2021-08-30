export class RecordRetrieveResponse {
  public anchor: number
  public client: string
  public message: string
  public status: string

  constructor(data: { anchor: number; client: string; message: string; status: string }) {
    this.anchor = data.anchor || 0
    this.client = data.client || ''
    this.message = data.message || ''
    this.status = data.status || 'Pending'
  }
}
