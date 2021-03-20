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
});
