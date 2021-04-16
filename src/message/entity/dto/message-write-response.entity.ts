export class MessageWriteResponse {
  public anchor: number
  public client: string
  public messages: string[]
  public status: string

  constructor(data: { anchor: number; client: string; messages: string[]; status: string }) {
    this.anchor = data.anchor || 0
    this.client = data.client || ''
    this.messages = data.messages || []
    this.status = data.status || 'Pending'
  }
}
