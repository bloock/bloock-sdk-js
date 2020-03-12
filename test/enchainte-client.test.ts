import { EnchainteClient } from "../src"
import Hash from "../src/hash";

jest.mock('axios');
import axios from 'axios';

import WriteSubscription from "../src/write-subscription";

const mockedAxios = axios as jest.Mocked<typeof axios>;

const subscription = WriteSubscription.getInstance();
subscription.push = jest.fn();

/**
 * Dummy test
 */
describe("Enchainte SDK Tests", () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
  })

  it('initializes', () => {
    expect(new EnchainteClient()).toBeInstanceOf(EnchainteClient)
  })

  it("Write function success", done => {
    let client = new EnchainteClient();

    (subscription.push as jest.Mock<any>).mockResolvedValueOnce(true);

    client.write(Hash.fromString('enchainte')).then(response => {
      expect(response).toBe(true);
      done();
    })
  })

  it("Write function error", done => {
    let client = new EnchainteClient();
    
    (subscription.push as jest.Mock<any>).mockResolvedValueOnce(false);

    client.write(Hash.fromString('enchainte')).then(response => {
      expect(response).toBe(false);
      done();
    })
  })

  it("Get proof function success", done => {
    let client = new EnchainteClient();
    
    mockedAxios.post.mockResolvedValue({ data: { proof: 'ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9' } } as any);

    client.getProof(Hash.fromString('enchainte')).then(response => {
      expect(response).toBe('ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9');
      done();
    })

    expect(mockedAxios.post).toHaveBeenCalled();
  })

  it("Get proof function error", done => {
    let client = new EnchainteClient();
    
    mockedAxios.post.mockRejectedValue({ status: 400 } as any);

    client.getProof(Hash.fromString('enchainte')).catch((error: Error) => {
      expect(error).toBeInstanceOf(Error);
      done();
    })

    expect(mockedAxios.post).toHaveBeenCalled();
  })
})
