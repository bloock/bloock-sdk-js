import { Anchor } from '../../../anchor/entity/anchor.entity'
import { Signature } from '../../../infrastructure/signing.client'
import { Proof } from '../../../proof/entity/proof.entity'
import { JSONDocument } from './json'

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
      _data_: content,
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
    expect(await file2.getSignatures()).toEqual(await file.getSignatures())
  })

  it('test_two_same_files_with_metadata_generates_same_payload', async () => {
    let json = {
      _data_: content,
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
    expect(await file2.getSignatures()).toEqual(await file.getSignatures())
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

    const signatures: Signature[] = []
    await file.addSignature(...signatures)

    expect(await file.getSignatures()).toEqual(signatures)

    let file2 = new JSONDocument(await file.build())
    await file2.ready
    expect(await file2.getSignatures()).toEqual(signatures)
  })

  it('test_set_signature_and_proof', async () => {
    let json = content
    let file = new JSONDocument(json)
    await file.ready

    const signatures: Signature[] = []
    await file.addSignature(...signatures)

    const proof = new Proof(
      ['leave1'],
      ['node1'],
      'depth',
      'bitmap',
      new Anchor(1, [''], [], '', 'pending')
    )
    await file.setProof(proof)

    expect(await file.getSignatures()).toEqual(signatures)
    expect(await file.getProof()).toEqual(proof)

    let file2 = new JSONDocument(await file.build())
    await file2.ready
    expect(await file2.getSignatures()).toEqual(signatures)
    expect(await file2.getProof()).toEqual(proof)
  })
})
