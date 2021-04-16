export class HttpRequestException implements Error {
  name: string = 'HttpRequestException'
  message: string = 'HttpClient response was not successful: unknown error.'
  stack?: string | undefined

  constructor(message?: string) {
    if (this.message) {
      this.message = `HttpClient response was not successful: ${message}.`
    }
  }
}
