import Web3 from 'web3';
import { injectable, inject } from "tsyringe";

import { ConfigService } from '../../config/service/config.service';
import { BlockchainClient } from "../blockchain.client";

@injectable()
export class Web3Client implements BlockchainClient {

    private configService: ConfigService;

    constructor(
        @inject("ConfigService") configService: ConfigService
    ) {
        this.configService = configService;
    }

    validateRoot(root: string): Promise<boolean> {
        const web3 = new Web3(new Web3.providers.HttpProvider(this.configService.getConfiguration().HTTP_PROVIDER));
        const contract = new web3.eth.Contract(
            JSON.parse(this.configService.getConfiguration().CONTRACT_ABI),
            this.configService.getConfiguration().CONTRACT_ADDRESS,
        );

        return contract.methods.getState(`0x${root}`).call();
    }
}