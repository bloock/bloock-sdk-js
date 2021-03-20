import * as blake2b from 'blakejs';
import { injectable, inject } from "tsyringe";

import { HashingClient } from "../hashing.client";

@injectable()
export class Blake2b implements HashingClient {
    generateHash(data: Uint8Array): string {
        return blake2b.blake2bHex(data, null, 32)
    }

}