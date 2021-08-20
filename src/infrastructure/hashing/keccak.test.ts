import { Utils } from '../../shared/utils'
import { HashingClient } from '../hashing.client'
import { Keccak } from './keccak'

describe('Keccak Tests', () => {
  it('Keccak test 1', async () => {
    const data = 'Test Data'

    const hashingAlgorithm: HashingClient = new Keccak()
    expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual(
      'e287462a142cd6237de5a89891ad82065f6aca6644c161b1a61c933c5d26117a'
    )
  })

  it('Keccak test 2', async () => {
    const data = 'Bloock'

    const hashingAlgorithm: HashingClient = new Keccak()
    expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual(
      '3a7ae5d1ca472a7459e484babf13adf1aa7fe78326755969e3e2f5fc7766f6ee'
    )
  })

  it('Keccak test 3', async () => {
    const data = 'testing keccak'

    const hashingAlgorithm: HashingClient = new Keccak()
    expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual(
      '7e5e383e8e70e55cdccfccf40dfc5d4bed935613dffc806b16b4675b555be139'
    )
  })

  it('Keccak test 4', async () => {
    const array = Uint8Array.from([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
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

    const hashingAlgorithm: HashingClient = new Keccak()
    expect(hashingAlgorithm.generateHash(array)).toEqual(
      'd5f4f7e1d989848480236fb0a5f808d5877abf778364ae50845234dd6c1e80fc'
    )
  })
})
