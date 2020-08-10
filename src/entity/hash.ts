import * as blake2b from 'blakejs';
import Utils from '../utils/utils';

export default class Hash {
    private hash: string;

    private constructor(hash: string) {
        this.hash = hash;
    }

    static from(data: unknown): Hash {
        return Hash.fromString(JSON.stringify(data));
    }

    static fromHash(hash: string): Hash {
        return new Hash(hash);
    }

    static fromHex(hex: string): Hash {
        const dataArray = Utils.hexToBytes(hex);
        return Hash.generateBlake2b(dataArray);
    }

    static fromString(_string: string): Hash {
        const dataArray = Utils.stringToBytes(_string);
        return Hash.generateBlake2b(dataArray);
    }

    static fromUint8Array(_uint8Array: Uint8Array): Hash {
        return Hash.generateBlake2b(_uint8Array);
    }

    static sort(hashes: Hash[]): Hash[] {
        return hashes.sort((a: Hash, b: Hash) => {
            const first = a.getHash().toUpperCase();
            const second = b.getHash().toUpperCase();
            return first < second ? -1 : first > second ? 1 : 0;
        });
    }

    static isValid(hash: unknown): boolean {
        if (hash instanceof Hash) {
            const _hash = (hash as Hash).getHash();

            if (_hash && _hash.length === 64 && Utils.isHex(_hash)) {
                return true;
            }
        }

        return false;
    }

    private static generateBlake2b(_data: Uint8Array): Hash {
        return new Hash(blake2b.blake2bHex(_data, null, 32));
    }

    public getHash(): string {
        return this.hash;
    }

    public getUint8ArrayHash(): Uint8Array {
        return Utils.hexToBytes(this.hash);
    }
}
