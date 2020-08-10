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

const messages = [
    Hash.fromString('Example Data 1'),
    Hash.fromString('Example Data 2'),
    Hash.fromString('Example Data 3')
];

client.getMessageStatus(messages)
    .then(status => {
        console.log(status);
    })
    .catch(error => {
        console.error(error);
    });
```