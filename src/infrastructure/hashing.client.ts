export interface HashingClient {
    generateHash(data: Uint8Array): string
}