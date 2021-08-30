export class RecordReceipt {
  public anchor: number
  public client: string
  public record: string
  public status: string

  constructor(anchor: number, client: string, record: string, status: string) {
    this.anchor = anchor
    this.client = client
    this.record = record
    this.status = status
  }
}
