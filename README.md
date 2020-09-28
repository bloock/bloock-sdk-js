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
const { Hash } = require('@enchainte/sdk');

// From an object
Hash.from({
    data: 'Example Data'
})

// From a hash string (hex encoded 64-chars long string)
Hash.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1')

// From a hex encoded string
Hash.fromHex('123456789abcdef')

// From a string
Hash.fromString('Example Data')

// From a Uint8Array with a lenght of 32
Hash.fromUint8Array(new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]))
```

### Write messages

This example shows how to send data to Enchainté

```javascript
const { EnchainteClient, Hash } = require('@enchainte/sdk');

const apiKey = process.env.API_KEY;

const client = new EnchainteClient(apiKey);
await client.onReady();

client.write(Hash.fromString('Example Data'))
    .then(success => {
        console.log(success);
    })
    .catch(error => {
        console.error(error);
    });
```


### Get and validate messages proof

This example shows how to get a proof for an array of messages and validate it:

```javascript
const { EnchainteClient, Hash } = require('@enchainte/sdk');

const apiKey = process.env.API_KEY;

const client = new EnchainteClient(apiKey);
await client.onReady();

const messages = [
    Hash.fromString('Example Data 1'),
    Hash.fromString('Example Data 2'),
    Hash.fromString('Example Data 3')
];

client.getProof(messages)
    .then(proof => {
        let valid = client.verify(proof);
        console.log(valid);
    })
    .catch(error => {
        console.error(error);
    });
```

### Get messages status

This example shows how to get all the details and status of messages:

```javascript
const { EnchainteClient, Hash } = require('@enchainte/sdk');

const apiKey = process.env.API_KEY;

const client = new EnchainteClient(apiKey);
await client.onReady();

const messages = [
    Hash.fromString('Example Data 1'),
    Hash.fromString('Example Data 2'),
    Hash.fromString('Example Data 3')
];

client.getMessages(messages)
    .then(status => {
        console.log(status);
    })
    .catch(error => {
        console.error(error);
    });
```

### Full example

This snippet shows a complete data cycle including: write, message status polling and proof retrieval and validation.

```javascript
const { EnchainteClient, Hash } = require('@enchainte/sdk');

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

    const client = new EnchainteClient(apiKey);
    await client.onReady();

    const hash = Hash.fromString(randHex(64));

    // Writing message
    const result = await client.write(hash);
    console.log('Write message - Successful!');

    if (!result) {
        return;
    }

    let found = false;
    while (!found) {
        // Polling message status
        const messages = await client.getMessages([hash]);
        for (let i = 0; i < messages.length; ++i) {
            if (messages[i].status === 'success') {
                found = true;
            }
        }

        await sleep(500);
    }
    console.log('Message reached Blockchain!');

    // Retrieving message proof
    const proof = await client.getProof([hash]);

    let valid = false;
    // Este 'while' es necesario a día de hoy ya que tiene que esperar a que la transacción se haya confirmado en Blockchain. En breve no será necesario.
    while (!valid) {
        // Validating message proof
        valid = await client.verify(proof);
        console.log(`Message validation - ${valid}`);
        await sleep(500);
    }
}

main()
    .then(() => console.log('Finished!'))
    .catch(console.error);
```