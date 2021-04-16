import { mock, MockProxy } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { HttpClient } from '../http.client'
import { HttpData } from './http-data'
import { HttpClientImpl } from './http-impl'

describe('Http Client Tests', () => {
  let httpDataMock: MockProxy<HttpData>

  beforeEach(() => {
    httpDataMock = mock<HttpData>()

    container.registerInstance('HttpData', httpDataMock)
    container.register('HttpClient', {
      useClass: HttpClientImpl
    })
  })

  it('test_http__init', () => {
    let httpClient = container.resolve<HttpClient>('HttpClient')

    expect(httpClient).toBeTruthy()
  })
})
