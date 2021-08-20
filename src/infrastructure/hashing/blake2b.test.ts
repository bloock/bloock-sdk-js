import { Utils } from '../../shared/utils'
import { HashingClient } from '../hashing.client'
import { Blake2b } from './blake2b'

describe('Blake2b Tests', () => {
  it('blake2b test 1', async () => {
    const data = 'Test Data'

    const hashingAlgorithm: HashingClient = new Blake2b()
    expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual(
      '7edb091de5d2cad1e65f9c124d3f3fda6895ec37b1bb0271aad78df6417a01e2'
    )
  })

  it('blake2b test 2', async () => {
    const data = 'Bloock'

    const hashingAlgorithm: HashingClient = new Blake2b()
    expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual(
      'a19776f33b618530921959039204d5221d038c449bb1fe0cc1dfcfb7e4b00521'
    )
  })
})
