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

    it('Check JSON normalized', () => {
        const data = {
            id: 1,
            name: "Test"
        }

        const invertedData = {
            name: "Test",
            id: 1
        }

        expect(Utils.stringify(data)).toEqual(Utils.stringify(invertedData));
    });
});
