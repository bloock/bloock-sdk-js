export class RecordRetrieveRequest {
  public messages: string[]

  constructor(records: string[]) {
    this.messages = records
  }
}
