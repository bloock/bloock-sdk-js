import * as blake2b from 'blakejs';
import Utils from '../utils/utils';

export default class Message {
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
        return Message.generateBlake2b(dataArray);
    }

    static fromString(_string: string): Message {
        const dataArray = Utils.stringToBytes(_string);
        return Message.generateBlake2b(dataArray);
    }

    static fromUint8Array(_uint8Array: Uint8Array): Message {
        return Message.generateBlake2b(_uint8Array);
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

    private static generateBlake2b(_data: Uint8Array): Message {
        return new Message(blake2b.blake2bHex(_data, null, 32));
    }

    public getHash(): string {
        return this.hash;
    }

    public getUint8ArrayHash(): Uint8Array {
        return Utils.hexToBytes(this.hash);
    }
}
