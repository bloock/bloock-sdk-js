import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { ConfigData } from '../repository/config-data'
import { ConfigRepositoryImpl } from '../repository/config-impl.repository'
import { ConfigRepository } from './config.repository'

describe('Config Service Tests', () => {
  let configDataMock: MockProxy<ConfigData>

  beforeEach(() => {
    configDataMock = mock<ConfigData>()

    container.registerInstance('ConfigData', configDataMock)
    container.register('ConfigRepository', {
      useClass: ConfigRepositoryImpl
    })
  })

  it('test_set_host', async () => {
    let configRepository = container.resolve<ConfigRepository>('ConfigRepository')

    configRepository.setApiHost('https://modified.bloock.com')
    expect(configDataMock.config.HOST).toBe('https://modified.bloock.com')
  })
})
