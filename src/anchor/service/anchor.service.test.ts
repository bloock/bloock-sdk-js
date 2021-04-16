import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { Configuration } from '../../config/entity/configuration.entity'
import { ConfigService } from '../../config/service/config.service'
import { HttpRequestException } from '../../infrastructure/http/exception/http.exception'
import { Anchor } from '../entity/anchor.entity'
import { WaitAnchorTimeoutException } from '../entity/exception/timeout.exception'
import { AnchorRepository } from '../repository/anchor.repository'
import { AnchorServiceImpl } from './anchor-impl.service'
import { AnchorService } from './anchor.service'

describe('Anchor Service Tests', () => {
  let configServiceMock: MockProxy<ConfigService>
  let anchorRepositoryMock: MockProxy<AnchorRepository>

  let counter = 0
  let maxCount = 0
  let getAnchorSideEffect = (id: number) => {
    if (counter < maxCount) {
      counter += 1
      throw new HttpRequestException('anchor not ready yet')
    }

    return Promise.resolve(new Anchor(1, ['block_root'], [], 'root', 'Success'))
  }

  beforeEach(() => {
    configServiceMock = mock<ConfigService>()
    anchorRepositoryMock = mock<AnchorRepository>()

    container.registerInstance('ConfigService', configServiceMock)
    container.registerInstance('AnchorRepository', anchorRepositoryMock)
    container.register('AnchorService', {
      useClass: AnchorServiceImpl
    })
  })

  it('test_get_anchor_okay', async () => {
    anchorRepositoryMock.getAnchor.mockResolvedValueOnce(
      new Anchor(1, ['block_root'], [], 'root', 'Success')
    )
    let anchorService = container.resolve<AnchorService>('AnchorService')
    let anchor = await anchorService.getAnchor(1)

    expect(anchor).toBeInstanceOf(Anchor)
    expect(anchor.id).toBe(1)
    expect(anchor.blockRoots).toStrictEqual(['block_root'])
    expect(anchor.networks).toStrictEqual([])
    expect(anchor.root).toBe('root')
    expect(anchor.status).toBe('Success')
  })

  it('test_wait_anchor_okay_first_try', async () => {
    counter = 0
    maxCount = 0

    let configuration = new Configuration()
    configuration.WAIT_MESSAGE_INTERVAL_DEFAULT = 1
    configuration.WAIT_MESSAGE_INTERVAL_FACTOR = 0
    configServiceMock.getConfiguration.mockReturnValue(configuration)

    anchorRepositoryMock.getAnchor.mockImplementation(getAnchorSideEffect)

    let anchorService = container.resolve<AnchorService>('AnchorService')
    let anchor = await anchorService.waitAnchor(1, 5000)

    expect(anchor).toBeInstanceOf(Anchor)
    expect(anchorRepositoryMock.getAnchor).toHaveBeenCalledTimes(maxCount + 1)
    expect(anchor.id).toBe(1)
    expect(anchor.blockRoots).toStrictEqual(['block_root'])
    expect(anchor.networks).toStrictEqual([])
    expect(anchor.root).toBe('root')
    expect(anchor.status).toBe('Success')
  })

  it('test_wait_anchor_okay_after_3_retries', async () => {
    counter = 0
    maxCount = 3

    let configuration = new Configuration()
    configuration.WAIT_MESSAGE_INTERVAL_DEFAULT = 1
    configuration.WAIT_MESSAGE_INTERVAL_FACTOR = 0
    configServiceMock.getConfiguration.mockReturnValue(configuration)

    anchorRepositoryMock.getAnchor.mockImplementation(getAnchorSideEffect)

    let anchorService = container.resolve<AnchorService>('AnchorService')
    let anchor = await anchorService.waitAnchor(1, 5000)

    expect(anchor).toBeInstanceOf(Anchor)
    expect(anchorRepositoryMock.getAnchor).toHaveBeenCalledTimes(maxCount + 1)
    expect(anchor.id).toBe(1)
    expect(anchor.blockRoots).toStrictEqual(['block_root'])
    expect(anchor.networks).toStrictEqual([])
    expect(anchor.root).toBe('root')
    expect(anchor.status).toBe('Success')
  })

  it('test_wait_anchor_error_timeout', async () => {
    counter = 0
    maxCount = 3

    let configuration = new Configuration()
    configuration.WAIT_MESSAGE_INTERVAL_DEFAULT = 10
    configuration.WAIT_MESSAGE_INTERVAL_FACTOR = 0
    configServiceMock.getConfiguration.mockReturnValue(configuration)

    anchorRepositoryMock.getAnchor.mockImplementation(getAnchorSideEffect)

    let anchorService = container.resolve<AnchorService>('AnchorService')
    await expect(anchorService.waitAnchor(1, 1)).rejects.toEqual(new WaitAnchorTimeoutException())
  })
})
