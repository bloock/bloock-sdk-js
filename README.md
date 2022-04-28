# Bloock SDK - Javascript

This SDK offers all the features available in the Bloock Toolset:

- Write records
- Signing records
- Get records proof
- Validate records
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

// From a JSON Document
let json = { hello: 'world' }
Record.fromJSON(json)

// From a PDF Document
let pdf = fs.readFileSync('./assets/dummy.pdf')
Record.fromPDF(pdf)
```

### Sign Record

You can sign a Record if it was constructed from JSON or from a PDF file. To use the sign functionality you need to provide private key as it's going to be used for the digital signature process. Remember to keep it safe!

**How can I generate a private key?**

Bloock libraries uses the ES256K signature algorithm that uses the secp256k1 <http://www.secg.org/sec2-v2.pdf> elliptic curve.

The private key needed to use the signing functionality needs to be specific for the elliptic curve used.

There are two ways to generate one:

1. Use a secp256k1 library, (i.e. <https://www.npmjs.com/package/secp256k1>)
2. (Not recommended) Use an online tool to generate one, such as: <https://secretscan.org/generator>.

This example shows how to sign records:

```javascript
const fs = require('fs')
const { Record } = require('@bloock/sdk')

// Sign a PDF
let pdf = fs.readFileSync('./assets/dummy.pdf')
let record = await Record.fromPDF(pdf)
// Random Private Key: 48c685c3af18890b5fd82cd8b62e157c9988392d8dfe0d4ad5ad723b6b8428a8
record = await record.sign('48c685c3af18890b5fd82cd8b62e157c9988392d8dfe0d4ad5ad723b6b8428a8')
// Retrieve signed record
console.log(await record.retrieve())

// Sign a JSON
let json = { hello: 'world' }
let record = await Record.fromJSON(json)
// Random Private Key: ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457
record = await record.sign('ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457')
console.log(await record.retrieve())
```

#### Verify Record signature

You can verify an array of Records. The verifier it is going to check only Records constructed from a JSON or a PDF file. Documents must be signed before running the verification.

```javascript
const fs = require('fs')
const { BloockClient, Record } = require('@bloock/sdk')

const apiKey = process.env.API_KEY

const client = new BloockClient(apiKey)

try {
  const valid = await client.verifySignatures(records)
  if (valid) {
    console.log('VALID SIGNATURE')
  } else {
    console.log('INVALID SIGNATURE')
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
  const proof = await client.getProof(records)
  console.log(proof)

  // Verify the proof
  const root = await client.verifyProof(proof)
  console.log(root)

  // Validate root from the proof on Blockchain
  const timestamp = await client.validateRoot(root, Network.ETHEREUM_MAINNET)
  console.log(timestamp)
} catch (error) {
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
} catch (error) {
  console.log(error)
}
```

### Full example

This snippet shows a complete data cycle including: sign (optional), write, wait for record confirmation and proof retrieval and validation. It uses the one function validation.

```javascript
const { BloockClient, Record } = require('@bloock/sdk')

async function main() {
  const apiKey = process.env.API_KEY
  const sdk = new BloockClient(apiKey)

  let json = { hello: 'world' }
  let record = await Record.fromJSON(json)
  // Optional
  // Random Private Key: ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457
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
