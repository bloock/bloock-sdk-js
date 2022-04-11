import { Anchor } from '../../../anchor/entity/anchor.entity'
import { Proof } from '../../../proof/entity/proof.entity'
import { JSONDocument } from './json'
import { Signature } from './signature'

describe('JSON document tests', () => {
  const content = { hello: 'world' }
  it('test_constructor', async () => {
    let json = content
    let file = new JSONDocument(json)
    await file.ready

    expect(await file.getPayload()).toEqual(json)
  })

  it('test_constructor_with_metadata', async () => {
    let json = {
      _payload_: content,
      _metadata_: {
        signature: ['signature1']
      }
    }
    let file = new JSONDocument(json)
    await file.ready

    expect(await file.getData()).toEqual(content)
  })

  it('test_two_same_files_generates_same_payload', async () => {
    let json = content

    let file = new JSONDocument(json)
    await file.ready

    let file2 = new JSONDocument(await file.build())
    await file2.ready

    expect(await file2.getData()).toEqual(await file.getData())
    expect(await file2.getPayload()).toEqual(await file.getPayload())
    expect(await file2.getProof()).toEqual(await file.getProof())
    expect(await file2.getSignature()).toEqual(await file.getSignature())
  })

  it('test_two_same_files_with_metadata_generates_same_payload', async () => {
    let json = {
      _payload_: content,
      _metadata_: {
        signature: ['signature1']
      }
    }
    let file = new JSONDocument(json)
    await file.ready

    let file2 = new JSONDocument(await file.build())
    await file2.ready

    expect(await file2.getData()).toEqual(await file.getData())
    expect(await file2.getPayload()).toEqual(await file.getPayload())
    expect(await file2.getProof()).toEqual(await file.getProof())
    expect(await file2.getSignature()).toEqual(await file.getSignature())
  })

  it('test_set_proof', async () => {
    let json = {
      hello: 'world'
    }
    let file = new JSONDocument(json)
    await file.ready

    const proof = new Proof(
      ['leave1'],
      ['node1'],
      'depth',
      'bitmap',
      new Anchor(1, [''], [], '', 'pending')
    )
    await file.setProof(proof)

    expect(await file.getProof()).toEqual(proof)

    let file2 = new JSONDocument(await file.build())
    await file2.ready
    expect(await file2.getProof()).toEqual(proof)
  })

  it('test_set_signature', async () => {
    let json = {
      hello: 'world'
    }
    let file = new JSONDocument(json)
    await file.ready

    const signature: Signature = { payload: "", signatures: [] }
    await file.setSignature(signature)

    expect(await file.getSignature()).toEqual(signature)

    let file2 = new JSONDocument(await file.build())
    await file2.ready
    expect(await file2.getSignature()).toEqual(signature)
  })

  it('test_set_signature_and_proof', async () => {
    let json = content
    let file = new JSONDocument(json)
    await file.ready

    const signature: Signature = { payload: "", signatures: [] }
    await file.setSignature(signature)

    const proof = new Proof(
      ['leave1'],
      ['node1'],
      'depth',
      'bitmap',
      new Anchor(1, [''], [], '', 'pending')
    )
    await file.setProof(proof)

    expect(await file.getSignature()).toEqual(signature)
    expect(await file.getProof()).toEqual(proof)

    let file2 = new JSONDocument(await file.build())
    await file2.ready
    expect(await file2.getSignature()).toEqual(signature)
    expect(await file2.getProof()).toEqual(proof)
  })
})
