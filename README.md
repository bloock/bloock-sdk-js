# Enchainté SDK -  Javascript

This SDK offers all the features available in the Enchainté Toolset:
- Write messages
- Get messages proof
- Validate proof
- Get messages details


## Installation

The SDK can be installed with the NPM package manager:

```shell
$ npm install @enchainte/sdk
```


## Usage

The following examples summarize how to access the different functionalities available:

### Prepare data

In order to interact with the SDK, the data should be processed through the Hash module.

There are several ways to generate a Hash:

```javascript
const { Message } = require('@enchainte/sdk');

// From an object
Message.from({
    data: 'Example Data'
})

// From a hash string (hex encoded 64-chars long string)
Message.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1')

// From a hex encoded string
Message.fromHex('123456789abcdef')

// From a string
Message.fromString('Example Data')

// From a Uint8Array with a lenght of 32
Message.fromUint8Array(new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
```

### Send messages

This example shows how to send data to Enchainté

```javascript
const { EnchainteClient, Message } = require('@enchainte/sdk');

const apiKey = process.env.API_KEY;

const client = new EnchainteClient(apiKey);

const messages = [
    Message.fromString('Example Data 1')
];
client.sendMessages(messages)
    .then(receipt => {
        console.log(receipt);
    })
    .catch(error => {
        console.error(error);
    });
```

### Get messages status

This example shows how to get all the details and status of messages:

```javascript
const { EnchainteClient, Message } = require('@enchainte/sdk');

const apiKey = process.env.API_KEY;

const client = new EnchainteClient(apiKey);

const messages = [
    Message.fromString('Example Data 1'),
    Message.fromString('Example Data 2'),
    Message.fromString('Example Data 3')
];
client.getMessages(messages)
    .then(receipts => {
        console.log(receipts);
    })
    .catch(error => {
        console.error(error);
    });
```

### Wait for messages to process

This example shows how to wait for a message to be processed by Enchainté after sending it.

```javascript
const { EnchainteClient, Message } = require('@enchainte/sdk');

const apiKey = process.env.API_KEY;

const client = new EnchainteClient(apiKey);

const messages = [
    Message.fromString('Example Data 1')
];

const receipts = await client.sendMessages(messages)

await client.waitAnchor(receipts[0].anchor)
```


### Get and validate messages proof

This example shows how to get a proof for an array of messages and validate it:

```javascript
const { EnchainteClient, Message } = require('@enchainte/sdk');

const apiKey = process.env.API_KEY;

const client = new EnchainteClient(apiKey);

const messages = [
    Message.fromString('Example Data 1'),
    Message.fromString('Example Data 2'),
    Message.fromString('Example Data 3')
];

client.getProof(messages)
    .then(proof => {
        let valid = client.verifyProof(proof);
        console.log(valid);
    })
    .catch(error => {
        console.error(error);
    });
```

### Full example

This snippet shows a complete data cycle including: write, message status polling and proof retrieval and validation.

```javascript
const { EnchainteClient, Message } = require('@enchainte/sdk');

// Helper function to wait some time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to get a random hex string
function randHex(len) {
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

async function main() {
    const apiKey = process.env.API_KEY;
    const sdk = new EnchainteClient(apiKey);

    const messages = [Message.fromString(randHex(64))];

    const sendReceipt = await sdk.sendMessages(messages);
    console.log('Write message - Successful!');

    if (!sendReceipt) {
        expect(false)
        return;
    }

    await sdk.waitAnchor(sendReceipt[0].anchor);
    console.log('Message reached Blockchain!');

    // Retrieving message proof
    const proof = await sdk.getProof(messages);
    const valid = await sdk.verifyProof(proof);
    console.log(`Message validation - ${valid}`);
}

main()
    .then(() => console.log('Finished!'))
    .catch(console.error);
```