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

// From a JSON Document
let json = { hello: 'world' }
Record.fromJSON(json)

// From a PDF Document
let pdf = fs.readFileSync('./assets/dummy.pdf')
Record.fromPDF(pdf)
```

#### Sign Record

You can sign a Record if it's of type Document: JSON or PDF. In order to sign a Record it's important to provide a private key. We are going to use the private key to encrypt the digital signature. The private key must be stored securely.

**How can I generate a private key?**
We hightly recommend to generate the private key with a strong source of entropy.
But to easily generate a private key you can check this website: <https://secretscan.org/generator>.

This example shows how to sign records. **Records must be Documents: PDF or JSON**

```javascript
const fs = require('fs')
const { Record } = require('@bloock/sdk')

// Sign a PDF
let pdf = fs.readFileSync('./assets/dummy.pdf')
let record = await Record.fromPDF(pdf)
// Random Ethereum Private Key: 48c685c3af18890b5fd82cd8b62e157c9988392d8dfe0d4ad5ad723b6b8428a8
record = await record.sign('48c685c3af18890b5fd82cd8b62e157c9988392d8dfe0d4ad5ad723b6b8428a8')

// Sign a JSON
let json = { hello: 'world' }
let record = await Record.fromJSON(json)
// Random Ethereum Private Key: ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457
record = await record.sign('ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457')
```

#### Verify Record

You can verify an array of Records. The verifier it is going to check only Records of type Document: JSON or PDF. Documents must be sign before executing the verification.

```javascript
const fs = require('fs')
const { BloockClient, Record } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

// Sign a PDF
let pdf = fs.readFileSync('./assets/dummy.pdf')
let record = await Record.fromPDF(pdf)
record = await record.sign('48c685c3af18890b5fd82cd8b62e157c9988392d8dfe0d4ad5ad723b6b8428a8')

const records = [record]

try {
  const valid = await client.verifySignatures(records)
  if (valid) {
    console.log("VALID SIGNATURE")
  } else {
    console.log("INVALID SIGNATURE")  
  }
} catch (error) {
  console.log(error)
}
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
const { BloockClient, Record, Network } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

const records = [Record.fromString('Example Data 1')]

const receipts = await client.sendRecords(records)

await client.waitAnchor(receipts[0].anchor)
```

### Get and validate records proof

This example shows a complete flow. 
  1. Get a proof for an array of records. 
  2. Verify the integrity proof.
  3. Validate the proof on Blockchain.

```javascript
const { BloockClient, Record, Network } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

const records = [
  Record.fromString('Example Data 1'),
  Record.fromString('Example Data 2'),
  Record.fromString('Example Data 3')
]

try {
  // Get the proof from records
  const proof = await client.getProof(records);
  console.log(proof)

  // Verify the proof
  const root = await client.verifyProof(proof);
  console.log(root)

  // Validate root from the proof on Blockchain
  const timestamp = await client.validateRoot(root, Network.ETHEREUM_MAINNET)
  console.log(timestamp)

} catch(error) {
  console.log(error)
}
```

You can also validate an array of records with one simple step. Internally it is going to do all the same process. You don't need to specify the network where is going to validate.

```javascript
const { BloockClient, Record, Network } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

const records = [
  Record.fromString('Example Data 1'),
  Record.fromString('Example Data 2'),
  Record.fromString('Example Data 3')
]

try {
  // Without specifying Network
  let timestamp = await client.verifyRecords(records)
  // Specifying Network
  let timestamp = await client.verifyRecords(records, Network.ETHEREUM_MAINNET) 

  console.log(timestamp)
} catch(error) {
  console.log(error)
}
```

### Full example

This snippet shows a complete data cycle including: write, wait for record confirmation and proof retrieval and validation.

```javascript
const { BloockClient, Record, Network } = require('@bloock/sdk')

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
  const root = await sdk.verifyProof(proof)
  const timestamp = await sdk.validateRoot(root, Network.ETHEREUM_MAINNET)
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

This snippet shows a complete data cycle including: sign, write, wait for record confirmation and proof retrieval and validation. It uses the one function validation.

```javascript
const { BloockClient, Record } = require('@bloock/sdk')

async function main() {
  const apiKey = process.env.API_KEY
  const sdk = new BloockClient(apiKey)

  let json = { hello: 'world' }
  let record = await Record.fromJSON(json)
  // Random Ethereum Private Key: ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457
  record = await record.sign('ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457')

  const records = [record]

  const sendReceipt = await sdk.sendRecords(records)
  console.log('Write record - Successful!')

  if (!sendReceipt) {
    expect(false)
    return
  }

  await sdk.waitAnchor(sendReceipt[0].anchor)
  console.log('Record reached Blockchain!')

  const timestamp = await sdk.verifyRecords(records)
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