import { EnchainteClient, Message } from '../src/index'

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
    test('E2E test', async () => {
        jest.setTimeout(120000)

        const apiKey = process.env["API_KEY"] || "";
        const sdk = new EnchainteClient(apiKey);

        const messages = [
            Message.fromString(randHex(64))
        ];

        const sendReceipt = await sdk.sendMessage(messages);

        if (!sendReceipt) {
            expect(false)
            return;
        }

        await sdk.waitAnchor(sendReceipt[0].anchor);

        const proof = await sdk.getProof(messages);
        expect(await sdk.verifyProof(proof)).toBe(true)
    });
});