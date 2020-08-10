import Web3 from 'web3';
import { WEB3_PROVIDER, CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';

export default class Web3Service {
    private static web3 = new Web3(new Web3.providers.WebsocketProvider(WEB3_PROVIDER));
    private static contract = new Web3Service.web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS);

    public static validateRoot(root: string): Promise<boolean> {
        return Web3Service.contract.methods.getCheckpoint(`0x${root}`).call();
    }
}
