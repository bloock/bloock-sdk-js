import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { Anchor } from '../../anchor/entity/anchor.entity'
import { JSONDocument } from '../../record/entity/document/json'
import { Record } from '../../record/entity/record.entity'
import { Proof } from '../entity/proof.entity'
import { ProofRepository } from '../repository/proof.repository'
import { ProofServiceImpl } from './proof-impl.service'
import { ProofService } from './proof.service'


describe('Proof Service Tests', () => {
  let proofRepositoryMock: MockProxy<ProofRepository>

  beforeEach(() => {
    proofRepositoryMock = mock<ProofRepository>()

    container.registerInstance('ProofRepository', proofRepositoryMock)
    container.register('ProofService', {
      useClass: ProofServiceImpl
    })
  })

  it('test_retrieve_proof_okay_from_json', async () => {
    let json = { hello: 'world' }
    let document = new JSONDocument(json)
    await document.ready
    let record = await Record.fromJSON(document)
    const records = [record]

    proofRepositoryMock.retrieveProof.mockResolvedValueOnce(
      new Proof(
        ['leave1'],
        ['node1'],
        'depth',
        'bitmap',
        new Anchor(1, [''], [], '', 'pending')
      )
    )

    let proofService = container.resolve<ProofService>('ProofService')
    let proof = await proofService.retrieveProof(records)

    expect(proof).toBeInstanceOf(Proof)
    expect(proof.anchor).toBeTruthy()
    expect(proof.bitmap).toBe('bitmap')
    expect(proof.depth).toBe('depth')
    expect(proof.leaves[0]).toBe('leave1')
    expect(proof.nodes[0]).toBe('node1')
    expect(record.getProof()).toBeTruthy()
  })

  it('test_retrieve_proof_not_proof_set_on_document', async () => {
    let json = { hello: 'world' }
    let document = new JSONDocument(json)
    await document.ready
    let record1 = await Record.fromJSON(document)
    let record2 = Record.fromString('mi-first-record')
    let record3 = Record.fromString('mi-second-record')
    const records = [record1, record2, record3]

    proofRepositoryMock.retrieveProof.mockResolvedValueOnce(
      new Proof(
        ['leave1'],
        ['node1'],
        'depth',
        'bitmap',
        new Anchor(1, [''], [], '', 'pending')
      )
    )

    let proofService = container.resolve<ProofService>('ProofService')
    let proof = await proofService.retrieveProof(records)

    expect(proof).toBeInstanceOf(Proof)
    expect(proof.anchor).toBeTruthy()
    expect(proof.bitmap).toBe('bitmap')
    expect(proof.depth).toBe('depth')
    expect(proof.leaves[0]).toBe('leave1')
    expect(proof.nodes[0]).toBe('node1')
    expect(record1.getProof()).toBeUndefined()
  })

  it('test_retrieve_proof_if_not_document_not_set_proof', async () => {
    let record = Record.fromString('mi-first-record')
    const records = [record]

    proofRepositoryMock.retrieveProof.mockResolvedValueOnce(
      new Proof(
        ['leave1'],
        ['node1'],
        'depth',
        'bitmap',
        new Anchor(1, [''], [], '', 'pending')
      )
    )

    let proofService = container.resolve<ProofService>('ProofService')
    let proof = await proofService.retrieveProof(records)

    expect(proof).toBeInstanceOf(Proof)
    expect(proof.anchor).toBeTruthy()
    expect(proof.bitmap).toBe('bitmap')
    expect(proof.depth).toBe('depth')
    expect(proof.leaves[0]).toBe('leave1')
    expect(proof.nodes[0]).toBe('node1')
    expect(record.getProof()).toBeUndefined()
  })

  it('test_retrieve_proof_if_already_set_return_same_proof', async () => {
    let json = { hello: 'world' }
    let document = new JSONDocument(json)
    await document.ready
    let record = await Record.fromJSON(document)
    const p = new Proof(
      ['leave1'],
      ['node1'],
      'depth',
      'bitmap',
      new Anchor(1, [''], [], '', 'pending')
    )
    await record.setProof(p)
    const records = [record]

    let proofService = container.resolve<ProofService>('ProofService')
    let proof = await proofService.retrieveProof(records)

    expect(proof).toBeInstanceOf(Proof)
    expect(proof.anchor).toBeTruthy()
    expect(proof.bitmap).toBe('bitmap')
    expect(proof.depth).toBe('depth')
    expect(proof.leaves[0]).toBe('leave1')
    expect(proof.nodes[0]).toBe('node1')
    expect(record.getProof()).toBe(p)
  })

  it('test_validate_signatures_from_records', async () => {
    let json = { hello: 'world' }
    let document = new JSONDocument(json)
    await document.ready
    let record = await Record.fromJSON(document)
    record = await record.sign("ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457")

    let json2 = { hello: 'world2' }
    let document2 = new JSONDocument(json2)
    await document2.ready
    let record2 = await Record.fromJSON(document2)
    record2 = await record2.sign("ecb8e554bba690eff53f1bc914941d34ae7ec446e0508d14bab3388d3e5c9457")

    const records = [record, record2]
    let proofService = container.resolve<ProofService>('ProofService')
    let valid = await proofService.verifySignatures(records)

    expect(valid).toBeTruthy()
  })

  it('test_invalid_signatures_from_records', async () => {
    let json = {
      _payload_: {
        hello: 'world'
      },
      _metadata_: {
        signature: ['signature1']
      }
    }

    let record = await Record.fromJSON(json)
    let records = [record]
    let proofService = container.resolve<ProofService>('ProofService')

    expect(await proofService.verifySignatures(records)).toBeFalsy()
  })
})