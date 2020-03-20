import Web3 from "web3";
import { WEB3_PROVIDER, CONTRACT_ADDRESS, CONTRACT_ABI, ETHERSCAN_URL } from "../utils/constants";
import Utils from "../utils/utils";
import { EventEmitter } from "events";

export default class Web3Service {
    private static web3 = new Web3(new Web3.providers.WebsocketProvider(WEB3_PROVIDER));
    private static contract = new Web3Service.web3.eth.Contract(JSON.parse(CONTRACT_ABI), CONTRACT_ADDRESS);

    public static validateRoot(root: Uint8Array): Promise<boolean> {        
        const rootString = Web3Service.web3.utils.asciiToHex(Utils.bytesToString(root));
        
        return Web3Service.contract.methods.getRoot(rootString).call();
    }

    public static getPastEvents(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            Web3Service.contract.getPastEvents('InsertedRoot', {fromBlock: 0, toBlock: 'latest'})
                .then((events: any[]) => {
                    events = events.map(event => {
                        return {
                            event: event.event,
                            transactionHash: event.transactionHash,
                            root: event.returnValues._root,
                            transactionUrl: `${ETHERSCAN_URL}${event.transactionHash}`
                        }
                    });
                    resolve(events);
                });
        })
    }

    public static getEvents(): EventEmitter {
        let emiter = new EventEmitter();

        let listener =  Web3Service.contract.events.InsertedRoot();

        listener.on('data', function(event: any){
            event = {
                event: event.event,
                transactionHash: event.transactionHash,
                root: event.returnValues._root,
                transactionUrl: `${ETHERSCAN_URL}${event.transactionHash}`
            }

            emiter.emit('data', event);
        })
        listener.on('changed', function(event: any){
            emiter.emit('changed', event)
        })
        listener.on('error', (error: any) => {
            emiter.emit('error', error)
        });

        return emiter;
    }
}
