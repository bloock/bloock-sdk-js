import { Utils } from './utils';

describe('Utils Tests', () => {
    it('is hex - success', () => {
        const hex = '123456789abcdef';

        expect(Utils.isHex(hex)).toBe(true);
    });

    it('is hex - error', () => {
        const hex = 'abcdefg';

        expect(Utils.isHex(hex)).toBe(false);
    });

    it('is uint16 to string - success', () => {
        const hex = '0100';
        var arr = Utils.hexToUint16(hex);
        expect(arr).toStrictEqual(new Uint16Array([256]));
        var arr2 = Utils.hexToBytes(hex);
        expect(arr2).toStrictEqual(new Uint8Array([1, 0]));
        expect(Utils.uint16ToHex(arr)).toStrictEqual(Utils.bytesToHex(new Uint8Array([1, 0])));
    });
});
