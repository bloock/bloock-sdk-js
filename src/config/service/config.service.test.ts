import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { ConfigEnv } from '../entity/config-env.entity'
import { ConfigData } from '../repository/config-data'
import { ConfigRepositoryImpl } from '../repository/config-impl.repository'
import { ConfigRepository } from '../repository/config.repository'

describe('Config Service Tests', () => {
  let configDataMock: MockProxy<ConfigData>

  beforeEach(() => {
    configDataMock = mock<ConfigData>()

    container.registerInstance('ConfigData', configDataMock)
    container.register('ConfigRepository', {
      useClass: ConfigRepositoryImpl
    })
  })

  it('test_fetch_configuration_prod', async () => {
    let configRepository = container.resolve<ConfigRepository>('ConfigRepository')

    configRepository.fetchConfiguration(ConfigEnv.PROD)
    expect(configDataMock.setConfiguration).toHaveBeenCalledTimes(1)
  })

  it('test_fetch_configuration_test', async () => {
    let configRepository = container.resolve<ConfigRepository>('ConfigRepository')

    configRepository.fetchConfiguration(ConfigEnv.TEST)
    expect(configDataMock.setTestConfiguration).toHaveBeenCalledTimes(1)
  })
})
