import Message from '../../src/entity/message';

/**
 * Dummy test
 */
describe('Enchainte SDK Tests', () => {
    it('Initialize from hex', () => {
        const message = Message.fromHex('123456789abcde');

        expect(message).toBeInstanceOf(Message);
        expect(message.getHash()).toBe('c4635b1a2898593fce2716446b429bd62396cba1e0189dbc9c34b5608deacc63');
    });

    it('Initialize from string', () => {
        const message = Message.fromString('enchainte');

        expect(message).toBeInstanceOf(Message);
        expect(message.getHash()).toBe('ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9');
    });

    it('Initialize from Uint8Array', () => {
        const message = Message.fromUint8Array(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

        expect(message).toBeInstanceOf(Message);
        expect(message.getHash()).toBe('e283ce217acedb1b0f71fc5ebff647a1a17a2492a6d2f34fb76b994a23ca8931');
    });

    it('Initialize from message', () => {
        const message = Message.fromHash('c4635b1a2898593fce2716446b429bd62396cba1e0189dbc9c34b5608deacc63');

        expect(message).toBeInstanceOf(Message);
        expect(message.getHash()).toBe('c4635b1a2898593fce2716446b429bd62396cba1e0189dbc9c34b5608deacc63');
    });

    it('Is valid - success', () => {
        const message = Message.fromHash('123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234');

        expect(Message.isValid(message)).toBe(true);
    });

    it('Is valid - error type', () => {
        const message = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234';

        expect(Message.isValid(message)).toBe(false);
    });

    it('Is valid - error lenght', () => {
        const message = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef';

        expect(Message.isValid(message)).toBe(false);
    });

    it('Is valid - error hex', () => {
        const message = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef123g';

        expect(Message.isValid(message)).toBe(false);
    });
});
