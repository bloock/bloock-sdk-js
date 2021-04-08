import Web3 from "web3";
import { injectable } from "tsyringe";

import { HashingClient } from "../hashing.client";
import { Utils } from "../../shared/utils";

@injectable()
export class Keccak implements HashingClient {
    generateHash(data: Uint8Array): string {
        let string = Utils.bytesToHex(data);
        const hash = Web3.utils.keccak256(`0x${string}`);
        if (!hash) {
            throw "Couldn't hash provided value (Keccak256)"
        }
        return hash.slice(2);
    }
}