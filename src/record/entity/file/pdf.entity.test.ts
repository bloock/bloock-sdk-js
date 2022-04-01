import fs from 'fs'
import { Proof } from '../../../proof/entity/proof.entity'
import { PDFFile } from './pdf'
import { RecordMetadata } from './record-metadata'

describe('PDF file tests', () => {
  it('test_constructor', async () => {
    let bytes = fs.readFileSync('./test/assets/dummy.pdf')
    let file = new PDFFile(bytes)
    await file.ready

    expect(await file.getContent()).toBeTruthy()
  })

  it('test_metadata', async () => {
    let bytes = fs.readFileSync('./test/assets/dummy.pdf')
    let file = new PDFFile(bytes)
    await file.ready
    await file.addRecordMetadata(
      new RecordMetadata({
        signature: ['signature1'],
        proof: new Proof(['leave1'], ['node1'], 'depth', 'bitmap')
      })
    )

    const metadata = await file.getRecordMetadata()
    expect(metadata?.signature).toEqual(['signature1'])
  })

  it('test_remove_metadata', async () => {
    let bytes = fs.readFileSync('./test/assets/dummy.pdf')
    let file = new PDFFile(bytes)
    await file.ready

    let content = await file.getContent()
    await file.addRecordMetadata(
      new RecordMetadata({
        signature: ['signature1'],
        proof: new Proof(['leave1'], ['node1'], 'depth', 'bitmap')
      })
    )

    fs.writeFileSync('./test/assets/dummy-with-metadata.pdf', await file.getFile())

    let bytes2 = fs.readFileSync('./test/assets/dummy-with-metadata.pdf')
    let file2 = new PDFFile(bytes2)
    await file2.ready

    let content2 = await file2.getContent()

    expect(content).toEqual(content2)
  })
})
