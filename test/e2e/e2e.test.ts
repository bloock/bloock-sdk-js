import { EnchainteClient } from '../../src';
import Message from '../../src/entity/message';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randHex(len: number) {
    const maxlen = 8;
    const min = Math.pow(16, Math.min(len, maxlen) - 1);
    const max = Math.pow(16, Math.min(len, maxlen)) - 1;
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    let r = n.toString(16);
    while (r.length < len) {
        r = r + randHex(len - maxlen);
    }
    return r;
}

describe('End to End Tests', () => {
    it('Initializes', async done => {
        jest.setTimeout(60000);

        const sdk = new EnchainteClient('uwtIk-iBhdkYjMdMgCGP0EywI4F8vsfuQjIIN7Z8mEzPpc4XbW2EfhqrxrZG2Uez');
        await sdk.onReady();

        const message = Message.fromString(randHex(64));

        const result = await sdk.sendMessage(message);

        if (!result) {
            return;
        }

        await sdk.waitMessageReceipts([message]);

        const proof = await sdk.getProof([message]);

        let valid = false;
        while (!valid) {
            valid = await sdk.verifyProof(proof);
            await sleep(500);
        }

        done();
    });
});
