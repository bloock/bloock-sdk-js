import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { Configuration } from '../entity/configuration.entity'
import { ConfigRepository } from '../repository/config.repository'
import { ConfigServiceImpl } from '../service/config-impl.service'
import { ConfigService } from '../service/config.service'

describe('Config Repository Tests', () => {
  let configRepositoryMock: MockProxy<ConfigRepository>

  beforeEach(() => {
    configRepositoryMock = mock<ConfigRepository>()

    container.registerInstance('ConfigRepository', configRepositoryMock)
    container.register('ConfigService', {
      useClass: ConfigServiceImpl
    })
  })

  it('test_get_configuration', async () => {
    let configService = container.resolve<ConfigService>('ConfigService')

    configService.getConfiguration()
    expect(configRepositoryMock.getConfiguration).toHaveBeenCalledTimes(1)
  })

  it('test_get_base_url', async () => {
    let configService = container.resolve<ConfigService>('ConfigService')

    let config = new Configuration()
    config.HOST = 'test'

    configRepositoryMock.getConfiguration.mockReturnValue(config)

    configService.getConfiguration()
    expect(configService.getApiBaseUrl()).toEqual('test')
  })

  it('test_set_host', async () => {
    let configService = container.resolve<ConfigService>('ConfigService')

    configService.setHost('https://api.bloock.com')
    expect(configRepositoryMock.setHost).toHaveBeenCalledTimes(1)
  })
})
