import axios, { AxiosRequestConfig } from 'axios'
import { inject, injectable } from 'tsyringe'
import { HttpClient } from '../http.client'
import { ApiResponse } from './dto/api-response.entity'
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
    let config: AxiosRequestConfig = {
      headers: {
        Authorization: this.httpData.apiKey,
        ...(headers ? Object.fromEntries(headers) : {})
      }
    }
    let response = await axios.get<ApiResponse<T>>(url, config)

    let success = response.data?.isSuccess()
    let data = response.data?.getData()
    if (success && data) {
      return data
    }

    throw new HttpRequestException(response.data.getError()?.message)
  }

  async post<T>(url: string, body: any, headers?: Map<string, string>): Promise<T> {
    let config: AxiosRequestConfig = {
      headers: {
        Authorization: this.httpData.apiKey,
        ...(headers ? Object.fromEntries(headers) : {})
      }
    }
    let response = await axios.post<ApiResponse<T>>(url, body, config)

    let success = response.data?.isSuccess()
    let data = response.data?.getData()
    if (success && data) {
      return data
    }

    throw new HttpRequestException(response.data.getError()?.message)
  }
}
