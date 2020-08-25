import { EnchainteClient } from '../../src';
import Hash from '../../src/entity/hash';

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

        const sdk = new EnchainteClient('jsiDYhZ70pc4L7HoFeMwz321QI40KfbzA2Y-5eW4IKtl3-CPW8tp3pitqB3VyZyI');
        await sdk.onReady();

        const hash = Hash.fromString(randHex(64));

        const result = await sdk.write(hash);

        if (!result) {
            return;
        }

        let found = false;
        while (!found) {
            const messages = await sdk.getMessages([hash]);
            for (let i = 0; i < messages.length; ++i) {
                if (messages[i].status === 'success') {
                    found = true;
                }
            }

            await sleep(500);
        }

        const proof = await sdk.getProof([hash]);

        let valid = false;
        while (!valid) {
            valid = await sdk.verify(proof);
            await sleep(500);
        }

        done();
    });
});
