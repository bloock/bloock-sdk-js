import Hash from '../../src/entity/hash';

/**
 * Dummy test
 */
describe('Enchainte SDK Tests', () => {
    it('Initialize from hex', () => {
        const hash = Hash.fromHex('123456789abcde');

        expect(hash).toBeInstanceOf(Hash);
        expect(hash.getHash()).toBe('c4635b1a2898593fce2716446b429bd62396cba1e0189dbc9c34b5608deacc63');
    });

    it('Initialize from string', () => {
        const hash = Hash.fromString('enchainte');

        expect(hash).toBeInstanceOf(Hash);
        expect(hash.getHash()).toBe('ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9');
    });

    it('Initialize from Uint8Array', () => {
        const hash = Hash.fromUint8Array(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

        expect(hash).toBeInstanceOf(Hash);
        expect(hash.getHash()).toBe('e283ce217acedb1b0f71fc5ebff647a1a17a2492a6d2f34fb76b994a23ca8931');
    });

    it('Initialize from hash', () => {
        const hash = Hash.fromHash('c4635b1a2898593fce2716446b429bd62396cba1e0189dbc9c34b5608deacc63');

        expect(hash).toBeInstanceOf(Hash);
        expect(hash.getHash()).toBe('c4635b1a2898593fce2716446b429bd62396cba1e0189dbc9c34b5608deacc63');
    });

    it('Is valid - success', () => {
        const hash = Hash.fromHash('123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234');

        expect(Hash.isValid(hash)).toBe(true);
    });

    it('Is valid - error type', () => {
        const hash = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234';

        expect(Hash.isValid(hash)).toBe(false);
    });

    it('Is valid - error lenght', () => {
        const hash = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef';

        expect(Hash.isValid(hash)).toBe(false);
    });

    it('Is valid - error hex', () => {
        const hash = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef123g';

        expect(Hash.isValid(hash)).toBe(false);
    });
});
