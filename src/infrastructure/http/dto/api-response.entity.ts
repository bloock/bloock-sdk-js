export class ApiError {
  public record: string
  public status: number
  public code: number

  constructor(data: { record: string; status: number; code: number }) {
    this.record = data.record
    this.status = data.status
    this.code = data.code
  }
}
