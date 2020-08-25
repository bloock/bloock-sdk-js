import Web3 from 'web3';
import ConfigService from './config.service';

export default class Web3Service {
    public static validateRoot(root: string): Promise<boolean> {
        const web3 = new Web3(new Web3.providers.WebsocketProvider(ConfigService.getConfig().PROVIDER));
        const contract = new web3.eth.Contract(
            JSON.parse(ConfigService.getConfig().CONTRACT_ABI),
            ConfigService.getConfig().CONTRACT_ADDRESS,
        );

        return contract.methods.getCheckpoint(`0x${root}`).call();
    }
}
