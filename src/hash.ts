import * as blake2b from "blakejs";

class Hash {

    private hash: string;

    private constructor(hash: string) {
        this.hash = hash;
    }

    static fromHex(hex: string): Hash {
        let dataArray = Uint8Array.from(Buffer.from(hex, 'hex'));
        return Hash.generateBlake2b(dataArray);
    }

    static fromString(_string: string): Hash {
        let dataArray = Uint8Array.from(Buffer.from(_string));
        return Hash.generateBlake2b(dataArray);
    }

    static fromUint8Array(_uint8Array: Uint8Array): Hash {
        return Hash.generateBlake2b(_uint8Array);
    }

    private static generateBlake2b(_data: Uint8Array): Hash {
        return new Hash(blake2b.blake2bHex(_data, null, 32));
    }

    public getHash(): string {
        return this.hash;
    }
}

export default Hash;