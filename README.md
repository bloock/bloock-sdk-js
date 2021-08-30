# Bloock SDK - Javascript

This SDK offers all the features available in the Bloock Toolset:

- Write records
- Get records proof
- Validate proof
- Get records details

## Installation

The SDK can be installed with the NPM package manager:

```shell
$ npm install @bloock/sdk
```

## Usage

The following examples summarize how to access the different functionalities available:

### Prepare data

In order to interact with the SDK, the data should be processed through the Hash module.

There are several ways to generate a Hash:

```javascript
const { Record } = require('@bloock/sdk')

// From an object
Record.from({
  data: 'Example Data'
})

// From a hash string (hex encoded 64-chars long string)
Record.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1')

// From a hex encoded string
Record.fromHex('123456789abcdef')

// From a string
Record.fromString('Example Data')

// From a Uint8Array with a lenght of 32
Record.fromUint8Array(
  new Uint8Array([
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1
  ])
)
```

### Send records

This example shows how to send data to Bloock

```javascript
const { BloockClient, Record } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

const records = [Record.fromString('Example Data 1')]
client
  .sendRecords(records)
  .then((receipt) => {
    console.log(receipt)
  })
  .catch((error) => {
    console.error(error)
  })
```

### Get records status

This example shows how to get all the details and status of records:

```javascript
const { BloockClient, Record } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

const records = [
  Record.fromString('Example Data 1'),
  Record.fromString('Example Data 2'),
  Record.fromString('Example Data 3')
]
client
  .getRecords(records)
  .then((receipts) => {
    console.log(receipts)
  })
  .catch((error) => {
    console.error(error)
  })
```

### Wait for records to process

This example shows how to wait for a record to be processed by Bloock after sending it.

```javascript
const { BloockClient, Record } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

const records = [Record.fromString('Example Data 1')]

const receipts = await client.sendRecords(records)

await client.waitAnchor(receipts[0].anchor)
```

### Get and validate records proof

This example shows how to get a proof for an array of records and validate it:

```javascript
const { BloockClient, Record } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

const records = [
  Record.fromString('Example Data 1'),
  Record.fromString('Example Data 2'),
  Record.fromString('Example Data 3')
]

client
  .getProof(records)
  .then((proof) => {
    let timestamp = client.verifyProof(proof)
    console.log(timestamp)
  })
  .catch((error) => {
    console.error(error)
  })
```

### Full example

This snippet shows a complete data cycle including: write, wait for record confirmation and proof retrieval and validation.

```javascript
const { BloockClient, Record } = require('@bloock/sdk')

// Helper function to wait some time
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper function to get a random hex string
function randHex(len) {
  const maxlen = 8
  const min = Math.pow(16, Math.min(len, maxlen) - 1)
  const max = Math.pow(16, Math.min(len, maxlen)) - 1
  const n = Math.floor(Math.random() * (max - min + 1)) + min
  let r = n.toString(16)
  while (r.length < len) {
    r = r + randHex(len - maxlen)
  }
  return r
}

async function main() {
  const apiKey = process.env.API_KEY
  const sdk = new BloockClient(apiKey)

  const records = [Record.fromString(randHex(64))]

  const sendReceipt = await sdk.sendRecords(records)
  console.log('Write record - Successful!')

  if (!sendReceipt) {
    expect(false)
    return
  }

  await sdk.waitAnchor(sendReceipt[0].anchor)
  console.log('Record reached Blockchain!')

  // Retrieving record proof
  const proof = await sdk.getProof(records)
  const timestamp = await sdk.verifyProof(proof)
  if (timestamp) {
    console.log(`Record is valid - Timestamp: ${timestamp}`)
  } else {
    console.log(`Record is invalid`)
  }
}

main()
  .then(() => console.log('Finished!'))
  .catch(console.error)
```
