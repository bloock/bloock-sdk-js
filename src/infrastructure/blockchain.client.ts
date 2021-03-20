export interface BlockchainClient {
    validateRoot(root: string): Promise<boolean>;
}