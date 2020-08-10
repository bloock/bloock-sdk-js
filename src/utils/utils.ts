import { Buffer } from 'buffer';
import Hash from '../entity/hash';

export default class Utils {
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
}
