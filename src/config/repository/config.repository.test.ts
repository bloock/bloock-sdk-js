import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { ConfigEnv } from '../entity/config-env.entity'
import { Configuration } from '../entity/configuration.entity'
import { ConfigServiceImpl } from '../service/config-impl.service'
import { ConfigService } from '../service/config.service'
import { ConfigRepository } from './config.repository'

describe('Config Repository Tests', () => {
  let configRepositoryMock: MockProxy<ConfigRepository>

  beforeEach(() => {
    configRepositoryMock = mock<ConfigRepository>()

    container.registerInstance('ConfigRepository', configRepositoryMock)
    container.register('ConfigService', {
      useClass: ConfigServiceImpl
    })
  })

  it('test_setup_environment', async () => {
    let configService = container.resolve<ConfigService>('ConfigService')

    configService.setupEnvironment(ConfigEnv.TEST)
    expect(configRepositoryMock.fetchConfiguration).toHaveBeenCalledTimes(1)
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
})
