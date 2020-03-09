import EnchainteSDK from "../src/enchainte-sdk-js"
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import Hash from "../src/hash";

/**
 * Dummy test
 */
describe("Enchainte SDK Tests", () => {
  beforeAll(() => {
    enableFetchMocks()
  })

  beforeEach(() => {
    fetch.resetMocks()
  })

  it('initializes', () => {
    expect(new EnchainteSDK("https://enchainte.com/api")).toBeInstanceOf(EnchainteSDK)
  })

  it("Write function success", () => {
    let sdk = new EnchainteSDK("https://enchainte.com/api");
    
    fetch.mockResponseOnce(JSON.stringify({ hash: 'ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9' }))

    sdk.write(Hash.fromString('enchainte')).then(response => {
      expect(response).toBe(true);
    })

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://enchainte.com/api/send')
  })

  it("Write function error", () => {
    let sdk = new EnchainteSDK("https://enchainte.com/api");
    
    fetch.mockResponseOnce(JSON.stringify(null), { status: 400 });

    sdk.write(Hash.fromString('enchainte')).then(response => {
      expect(response).toBe(false);
    })

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://enchainte.com/api/send')
  })

  it("Get proof function success", () => {
    let sdk = new EnchainteSDK("https://enchainte.com/api");
    
    fetch.mockResponseOnce(JSON.stringify({ proof: 'ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9' }))

    sdk.getProof(Hash.fromString('enchainte')).then(response => {
      expect(response).toBe('ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9');
    })

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://enchainte.com/api/verify')
  })

  it("Get proof function error", () => {
    let sdk = new EnchainteSDK("https://enchainte.com/api");
    
    fetch.mockResponseOnce(JSON.stringify(null), { status: 400 });

    sdk.getProof(Hash.fromString('enchainte')).catch((error: Error) => {
      expect(error).toBeInstanceOf(Error);
    })

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://enchainte.com/api/verify')
  })
})
