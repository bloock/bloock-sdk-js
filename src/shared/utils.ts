import { Buffer } from 'buffer';
import { Message } from '../message/entity/message.entity';

export class Utils {
    public static stringToBytes(string: string): Uint8Array {
        return Uint8Array.from(Buffer.from(string));
    }

    public static hexToBytes(hex: string): Uint8Array {
        return Uint8Array.from(Buffer.from(hex, 'hex'));
    }

    public static bytesToString(array: Uint8Array): string {
        let string = '';
        for (let i = 0; i < array.byteLength; i++) {
            string += String.fromCharCode(array[i]);
        }
        return string;
    }

    public static bytesToHex(array: Uint8Array): string {
        return Buffer.from(array).toString('hex');
    }

    public static isHex(h: string): boolean {
        const regexp = /^[0-9a-fA-F]+$/;
        return regexp.test(h);
    }

    public static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static merge(left: Uint8Array, right: Uint8Array): Uint8Array {
        const concat = new Uint8Array(left.length + right.length);
        concat.set(left);
        concat.set(right, left.length);

        return Message.fromUint8Array(concat).getUint8ArrayHash();
    }
}
