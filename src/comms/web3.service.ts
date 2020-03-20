import Web3 from "web3";
import { WEB3_PROVIDER, CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/constants";
import Utils from "../utils/utils";

export default class Web3Service {

    public static validateRoot(root: Uint8Array): Promise<boolean> {
        // const abi = CONTRACT_ABI;
        // const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
        // const contract = new web3.eth.Contract(JSON.parse(abi), CONTRACT_ADDRESS);
        
        // const rootString = web3.utils.asciiToHex(Utils.bytesToString(root));
        
        // return contract.methods.getRoot(rootString).call();

        return Promise.resolve(true);
    }
}