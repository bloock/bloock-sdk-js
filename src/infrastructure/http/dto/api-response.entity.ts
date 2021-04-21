export class ApiResponse<T> {
  public success: boolean
  public data?: T
  public error?: ApiError

  constructor(data: ApiResponse<T>) {
    this.success = data.success

    if (data.data) {
      this.data = data.data
    }

    if (data.error) {
      this.error = new ApiError(data.error)
    }
  }

  public isSuccess(): boolean {
    if (this.success) {
      return true
    }
    return false
  }

  public getData(): T | undefined {
    if (this.data) {
      return this.data
    }
  }

  public getError(): ApiError | undefined {
    if (this.error) {
      return this.error
    }
  }
}

export class ApiError {
  public message: string
  public status: number

  constructor(data: { message: string; status: number }) {
    this.message = data.message
    this.status = data.status
  }
}
