import axios, { AxiosError, AxiosRequestConfig } from 'axios'
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

    let data: ApiResponse<T>
    try {
      let response = await axios.get<ApiResponse<T>>(url, config)
      data = response.data
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        let error = err as AxiosError
        data = error.response?.data
      } else {
        throw new HttpRequestException()
      }
    }

    if (!(data instanceof ApiResponse)) {
      data = new ApiResponse<T>(data)
    }

    let success = data?.isSuccess()
    let result = data?.getData()
    if (success && result) {
      return result
    }
    throw new HttpRequestException(data.getError()?.message)
  }

  async post<T>(url: string, body: any, headers?: Map<string, string>): Promise<T> {
    let config: AxiosRequestConfig = {
      headers: {
        Authorization: this.httpData.apiKey,
        ...(headers ? Object.fromEntries(headers) : {})
      }
    }

    let data: ApiResponse<T>
    try {
      let response = await axios.post<ApiResponse<T>>(url, body, config)
      data = response.data
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        let error = err as AxiosError
        data = error.response?.data
      } else {
        throw new HttpRequestException()
      }
    }

    if (!(data instanceof ApiResponse)) {
      data = new ApiResponse<T>(data)
    }

    let success = data?.isSuccess()
    let result = data?.getData()
    if (success && result) {
      return result
    }
    throw new HttpRequestException(data.getError()?.message)
  }
}
