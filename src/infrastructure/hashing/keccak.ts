import Web3 from "web3";
import { injectable } from "tsyringe";

import { HashingClient } from "../hashing.client";
import { Utils } from "../../shared/utils";

@injectable()
export class Keccak implements HashingClient {
    generateHash(data: Uint8Array): string {
        let string = Utils.bytesToHex(data);
        return Web3.utils.keccak256(string)
    }

}