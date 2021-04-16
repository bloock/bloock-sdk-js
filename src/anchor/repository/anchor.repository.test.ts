import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { ConfigService } from '../../config/service/config.service'
import { HttpClient } from '../../infrastructure/http.client'
import { Anchor } from '../entity/anchor.entity'
import { AnchorRetrieveResponse } from '../entity/dto/anchor-retrieve-response.entity'
import { AnchorRepositoryImpl } from './anchor-impl.repository'
import { AnchorRepository } from './anchor.repository'

describe('Anchor Repository Tests', () => {
  let configServiceMock: MockProxy<ConfigService>
  let httpClientMock: MockProxy<HttpClient>

  beforeEach(() => {
    configServiceMock = mock<ConfigService>()
    httpClientMock = mock<HttpClient>()

    container.registerInstance('ConfigService', configServiceMock)
    container.registerInstance('HttpClient', httpClientMock)
    container.register('AnchorRepository', {
      useClass: AnchorRepositoryImpl
    })
  })

  it('test_get_anchor_okay', async () => {
    configServiceMock.getApiBaseUrl.mockReturnValueOnce("i'm definitely a URL")

    httpClientMock.get.mockResolvedValueOnce(
      new AnchorRetrieveResponse({
        anchor_id: 1,
        block_roots: ['block_root'],
        networks: [],
        root: 'root',
        status: 'Success'
      })
    )

    let anchorRepository = container.resolve<AnchorRepository>('AnchorRepository')
    let anchor = await anchorRepository.getAnchor(1)

    expect(anchor).toBeInstanceOf(Anchor)
    expect(anchor.id).toBe(1)
    expect(anchor.blockRoots).toStrictEqual(['block_root'])
    expect(anchor.networks).toStrictEqual([])
    expect(anchor.root).toBe('root')
    expect(anchor.status).toBe('Success')
  })
})
