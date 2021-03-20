export interface HttpClient {
    setApiKey(apiKey: string): void;
    get<T>(url: string, headers?: Map<string, string>): Promise<T>
    post<T>(url: string, body: any, headers?: Map<string, string>): Promise<T>
}