import { EnchainteClient } from "../src"
import Hash from "../src/utils/hash";
import Writer from "../src/write/writer";

jest.mock('axios');
import axios from 'axios';


const mockedAxios = axios as jest.Mocked<typeof axios>;

const subscription = Writer.getInstance();
subscription.push = jest.fn();

/**
 * Dummy test
 */
describe("Enchainte SDK Tests", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
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

  it("Verify function success - true", async () => {
    let client = new EnchainteClient();
    
    let proof = [
      "785c6e630cfd60b6e998aac429ada1d24943f0397aa0109f480a4f7c11f1e553",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "60fb452d588482f5b6d7a25a22d2fcf44707493b3125f8ebafdfa408ba2b4d3d",
      "0101010101010101010101010101010101010101010101010101010101010101"
    ];

    let valid = await client.verify(proof)
    expect(valid).toBe(true);
  })

  it("Verify function success - false", async () => {
    let client = new EnchainteClient();
    
    let proof = [
        "dc48d20062ef377852b9385c676758069169af67ec5b9b0eff538dfbfb1972c8",
        "7f5f92ca6d84f8ec81a3226c6a21beab47959692a90cc2471f9339c2a6cd0c88",
        "0101010101010101010101010101010101010101010101010101010101010101",
        "68dc8616facefebc3c41c31043d42a3906db53809b1f13c43718ba796214b55f",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434",
        "5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1"
      ];

    let valid = await client.verify(proof)
    
    expect(valid).toBe(false);
  })

  it("Get proof success", done => {
    let client = new EnchainteClient();
    
    mockedAxios.get.mockResolvedValue({ data: {
      proof: [
        "dc48d20062ef377852b9385c676758069169af67ec5b9b0eff538dfbfb1972c8",
        "7f5f92ca6d84f8ec81a3226c6a21beab47959692a90cc2471f9339c2a6cd0c88",
        "0101010101010101010101010101010101010101010101010101010101010101",
        "68dc8616facefebc3c41c31043d42a3906db53809b1f13c43718ba796214b55f",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434",
        "5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1"
      ]
    }} as any);

    client.getProof(Hash.fromString('ycgmjvu5llj8o1xuq38qx9'))
      .then(res => {
        done();
      })

    expect(mockedAxios.get).toHaveBeenCalled();
  })

  it("Get proof error", done => {
    let client = new EnchainteClient();
    
    mockedAxios.get.mockRejectedValueOnce({ data: { hash: 'hash' }, status: 400 } as any);

    client.getProof(Hash.fromString('ycgmjvu5llj8o1xuq38qx9'))
      .catch(error => {
        done();
      })

    expect(mockedAxios.get).toHaveBeenCalled();
  })
})
