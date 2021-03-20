import { EnchainteClient, Message } from "../src";

describe('Functional Tests', () => {
    test('testSendMessage', async () => {
        jest.setTimeout(120000)

        const apiKey = process.env["API_KEY"] || "";
        const sdk = new EnchainteClient(apiKey);

        const messages = [
            Message.fromString("Example Data")
        ];

        const sendReceipt = await sdk.sendMessage(messages);

        if (!sendReceipt) {
            expect(false)
            return;
        }

        await sdk.waitAnchor(sendReceipt[0].anchor);
    });

    test('testWaitAnchor', async () => {
        jest.setTimeout(120000)

        const apiKey = process.env["API_KEY"] || "";
        const sdk = new EnchainteClient(apiKey);

        const messages = [
            Message.fromString("Example Data 1"),
            Message.fromString("Example Data 2"),
            Message.fromString("Example Data 3")
        ];

        const sendReceipt = await sdk.sendMessage(messages);

        if (!sendReceipt) {
            expect(false)
            return;
        }

        let receipt = await sdk.waitAnchor(sendReceipt[0].anchor);
        expect(receipt).toBeDefined()
    });

    test('testFetchMessages', async () => {
        jest.setTimeout(120000)

        const apiKey = process.env["API_KEY"] || "";
        const sdk = new EnchainteClient(apiKey);

        const messages = [
            Message.fromString("Example Data 1"),
            Message.fromString("Example Data 2"),
            Message.fromString("Example Data 3")
        ];

        const sendReceipt = await sdk.sendMessage(messages);

        if (!sendReceipt) {
            expect(false)
            return;
        }

        await sdk.waitAnchor(sendReceipt[0].anchor);

        let messageReceipts = await sdk.getMessages(messages);
        for (let messageReceipt of messageReceipts) {
            expect(messageReceipt.status).toBe("Success")
        }
    });

    test('testGetProof', async () => {
        jest.setTimeout(120000)

        const apiKey = process.env["API_KEY"] || "";
        const sdk = new EnchainteClient(apiKey);

        const messages = [
            Message.fromString("Example Data 1"),
            Message.fromString("Example Data 2"),
            Message.fromString("Example Data 3")
        ];

        let proof = await sdk.getProof(messages);
        expect(proof).toBeDefined();
    });
});
