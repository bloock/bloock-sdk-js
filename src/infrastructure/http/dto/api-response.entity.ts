export class ApiError {
  public message: string
  public status: number
  public code: number

  constructor(data: { message: string; status: number; code: number }) {
    this.message = data.message
    this.status = data.status
    this.code = data.code
  }
}
