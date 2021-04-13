import { Buffer } from 'buffer';
import stringify from 'json-stable-stringify';
import { Message } from '../message/entity/message.entity';

export class Utils {
    public static stringify(data: any): string {
        return stringify(data);
    }

    public static stringToBytes(string: string): Uint8Array {
        return Uint8Array.from(Buffer.from(string));
    }

    public static hexToBytes(hex: string): Uint8Array {
        if (!Utils.isHex(hex)) {
            throw 'Parameter is not hexadecimal.';
        }
        else if (hex.length % 2 == 1) {
            throw 'Parameter is missing last character to be represented in bytes.';
        }
        return Uint8Array.from(Buffer.from(hex, 'hex'));
    }

    public static hexToUint16(hex: string): Uint16Array {
        if (hex.length % 4 != 0) {
            throw 'Parameter is missing last characters to be represented in uint16.';
        }
        let bytes = Utils.hexToBytes(hex);
        let result = new Uint16Array(bytes.length / 2);

        var i;
        for (i = 0; i < result.length; i++) {
            result[i] = bytes[i * 2 + 1] + (bytes[i * 2] << 8);
        }
        return result;
    }

    public static bytesToHex(array: Uint8Array): string {
        return Buffer.from(array).toString('hex');
    }

    public static uint16ToHex(array: Uint16Array): string {
        let result = new Uint8Array(array.length * 2);

        var i;
        for (i = 0; i < array.length; i++) {
            result[i * 2 + 1] = array[i];
            result[i * 2] = array[i] >> 8;
        }

        return Utils.bytesToHex(result);
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
