import { Message } from './message.entity';

describe('Message entity tests', () => {
    it('Initialize from hex', () => {
        const message = Message.fromHex('123456789abcde');

        expect(message).toBeInstanceOf(Message);
        expect(message.getHash()).toBe('309736c47755d298bbf457c9ba1cdc8062b978b3a485feedac3cf5a9a4cd3c71');
    });

    it('Initialize from string', () => {
        const message = Message.fromString('enchainte');

        expect(message).toBeInstanceOf(Message);
        expect(message.getHash()).toBe('be539a778a3752e2f32774bbeb773a53ac399103edf9623ea1960c9dc919f3c1');
    });

    it('Initialize from Uint8Array', () => {
        const message = Message.fromUint8Array(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

        expect(message).toBeInstanceOf(Message);
        expect(message.getHash()).toBe('9da417b185bdb924824f0b07be0ef0de377b27eea9e48a66082d40a6038f305c');
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
