export interface BlockchainClient {
    validateRoot(root: string): Promise<number>;
}