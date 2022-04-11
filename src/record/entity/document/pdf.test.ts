import fs from 'fs'
import { Anchor } from '../../../anchor/entity/anchor.entity'
import { Proof } from '../../../proof/entity/proof.entity'
import { PDFDocument } from './pdf'
import { Signature } from './signature/signature'

describe('PDF document tests', () => {
  const bytes = fs.readFileSync('./test/assets/dummy.pdf')
  const bytesWithMetadata = fs.readFileSync('./test/assets/dummy-with-metadata.pdf')

  it('test_constructor', async () => {
    let file = new PDFDocument(bytes)
    await file.ready

    expect(await file.getPayload()).toBeTruthy()
  })

  it('test_constructor_with_metadata', async () => {
    let file = new PDFDocument(bytesWithMetadata)
    await file.ready

    expect(await file.getPayload()).toBeTruthy()
  })

  it('test_two_same_files_generates_same_payload', async () => {
    let file = new PDFDocument(bytes)
    await file.ready

    let file2 = new PDFDocument(await file.build())
    await file2.ready

    expect(await file2.getData()).toEqual(await file.getData())
    expect(await file2.getPayload()).toEqual(await file.getPayload())
    expect(await file2.getProof()).toEqual(await file.getProof())
    expect(await file2.getSignature()).toEqual(await file.getSignature())
  })

  it('test_two_same_files_with_metadata_generates_same_payload', async () => {
    let file = new PDFDocument(bytesWithMetadata)
    await file.ready

    let file2 = new PDFDocument(await file.build())
    await file2.ready

    expect(await file2.getData()).toEqual(await file.getData())
    expect(await file2.getPayload()).toEqual(await file.getPayload())
    expect(await file2.getProof()).toEqual(await file.getProof())
    expect(await file2.getSignature()).toEqual(await file.getSignature())
  })

  it('test_set_proof', async () => {
    let file = new PDFDocument(bytes)
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

    let file2 = new PDFDocument(await file.build())
    await file2.ready
    expect(await file2.getProof()).toEqual(proof)
  })

  it('test_set_signature', async () => {
    let file = new PDFDocument(bytes)
    await file.ready

    const signature: Signature = { payload: "", signatures: [] }
    await file.setSignature(signature)

    expect(await file.getSignature()).toEqual(signature)

    let file2 = new PDFDocument(await file.build())
    await file2.ready
    expect(await file2.getSignature()).toEqual(signature)
  })

  it('test_set_signature_and_proof', async () => {
    let file = new PDFDocument(bytes)
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

    let file2 = new PDFDocument(await file.build())
    await file2.ready
    expect(await file2.getSignature()).toEqual(signature)
    expect(await file2.getProof()).toEqual(proof)
  })
})
