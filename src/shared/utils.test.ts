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

    it('test merge 1', () => {
        const hex = 'abcdefg';

        const node = Utils.merge(
            Utils.hexToBytes('41bcb06d484dcf736bf0ca40fdf55cda8f7f8faa9aebc0a18c7592de4a89ae6a'),
            Utils.hexToBytes('54944fcea707a57048c17ca7453fa5078a031143b44629776750e7f0ff7940f0')
        );

        console.log(node)
        console.log(Utils.bytesToHex(node))

        const root = Utils.merge(
            Utils.hexToBytes('156406637741bf96489d1626b500ecbdf7e8dee2705074b85ac66e3167f18b2a'),
            node
        );

        expect(Utils.bytesToHex(root)).toBe('73f18d573c3f0ca6ffc30e70bc977d7093aca98fa9ca99164794321e116a609e');
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
