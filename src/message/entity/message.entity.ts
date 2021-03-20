import { HashingClient } from '../../infrastructure/hashing.client';
import { Blake2b } from '../../infrastructure/hashing/blake2b';
import { Utils } from '../../shared/utils';

export class Message {
    private static hashAlgorithm: HashingClient = new Blake2b();

    private hash: string;

    private constructor(hash: string) {
        this.hash = hash;
    }

    static from(data: unknown): Message {
        return Message.fromString(JSON.stringify(data));
    }

    static fromHash(hash: string): Message {
        return new Message(hash);
    }

    static fromHex(hex: string): Message {
        const dataArray = Utils.hexToBytes(hex);
        return new Message(this.hashAlgorithm.generateHash(dataArray))
    }

    static fromString(_string: string): Message {
        const dataArray = Utils.stringToBytes(_string);
        return new Message(this.hashAlgorithm.generateHash(dataArray))
    }

    static fromUint8Array(_uint8Array: Uint8Array): Message {
        return new Message(this.hashAlgorithm.generateHash(_uint8Array))
    }

    static sort(messages: Message[]): Message[] {
        return messages.sort((a: Message, b: Message) => {
            const first = a.getHash().toUpperCase();
            const second = b.getHash().toUpperCase();
            return first < second ? -1 : first > second ? 1 : 0;
        });
    }

    static isValid(message: unknown): boolean {
        if (message instanceof Message) {
            const _message = (message as Message).getHash();

            if (_message && _message.length === 64 && Utils.isHex(_message)) {
                return true;
            }
        }

        return false;
    }

    public getHash(): string {
        return this.hash;
    }

    public getUint8ArrayHash(): Uint8Array {
        return Utils.hexToBytes(this.hash);
    }
}
