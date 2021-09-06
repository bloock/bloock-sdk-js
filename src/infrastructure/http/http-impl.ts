import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios'
import { inject, injectable } from 'tsyringe'
import { HttpClient } from '../http.client'
import { HttpRequestException } from './exception/http.exception'
import { HttpData } from './http-data'

@injectable()
export class HttpClientImpl implements HttpClient {
  private httpData: HttpData

  constructor(@inject('HttpData') httpData: HttpData) {
    this.httpData = httpData
  }

  setApiKey(apiKey: string): void {
    this.httpData.apiKey = apiKey
  }

  async get<T>(url: string, headers?: Map<string, string>): Promise<T> {
    return await this.request('GET', url, null, headers)
  }

  async post<T>(url: string, body: any, headers?: Map<string, string>): Promise<T> {
    return await this.request('POST', url, body, headers)
  }

  private async request<T>(method: Method, url: string, body?: any, headers?: Map<string, string>) {
    let config: AxiosRequestConfig = {
      method,
      url,
      data: body ? body : null,
      headers: {
        ...(headers ? headers : {}),
        'X-Api-Key': this.httpData.apiKey
      }
    }

    try {
      let response = await axios.request<T>(config)
      return response.data
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        let error = err as AxiosError

        if (error.response?.status == 401) {
          throw new HttpRequestException('Invalid API Key provided')
        } else {
          let responseError = error.response?.data
          throw new HttpRequestException(
            responseError?.message ? responseError?.message : error.response?.status
          )
        }
      } else {
        throw new HttpRequestException()
      }
    }
  }
}
