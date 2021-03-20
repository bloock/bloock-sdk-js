import { injectable, inject } from "tsyringe";
import axios, { AxiosRequestConfig } from 'axios';

import { HttpClient } from "../http.client";
import { HttpData } from "./http-data";
import { ApiResponse } from "./dto/api-response.entity";

@injectable()
export class HttpClientImpl implements HttpClient {

    private httpData: HttpData;

    constructor(
        @inject("HttpData") httpData: HttpData
    ) {
        this.httpData = httpData;
    }

    setApiKey(apiKey: string): void {
        this.httpData.apiKey = apiKey;
    }
    async get<T>(url: string, headers?: Map<string, string>): Promise<T> {
        let config: AxiosRequestConfig = {
            headers: {
                "Authorization": this.httpData.apiKey,
                ...(headers ? Object.fromEntries(headers) : {})
            }
        }
        let response = await axios.get<ApiResponse<T>>(url, config)
        return response.data.data;
    }
    async post<T>(url: string, body: any, headers?: Map<string, string>): Promise<T> {
        let config: AxiosRequestConfig = {
            headers: {
                "Authorization": this.httpData.apiKey,
                ...(headers ? Object.fromEntries(headers) : {})
            }
        }
        let response = await axios.post<ApiResponse<T>>(url, body, config);
        return response.data.data;
    }
}