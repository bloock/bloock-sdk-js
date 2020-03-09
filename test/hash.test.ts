import EnchainteSDK from "../src/enchainte-sdk-js"
import Hash from "../src/hash"

/**
 * Dummy test
 */
describe("Enchainte SDK Tests", () => {
  it('Initialize from hex', () => {
    let hash = Hash.fromHex('123456789abcde');

    expect(hash).toBeInstanceOf(Hash);
    expect(hash.getHash()).toBe("c4635b1a2898593fce2716446b429bd62396cba1e0189dbc9c34b5608deacc63")
  });

  it('Initialize from string', () => {
    let hash = Hash.fromString('enchainte');

    expect(hash).toBeInstanceOf(Hash);
    expect(hash.getHash()).toBe("ab8e3ff984fce36be6e6cf01ec215df86556089bdebc20a663b4305f2fb67dc9")
  });

  it('Initialize from Uint8Array', () => {
    let hash = Hash.fromUint8Array(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

    expect(hash).toBeInstanceOf(Hash);
    expect(hash.getHash()).toBe("e283ce217acedb1b0f71fc5ebff647a1a17a2492a6d2f34fb76b994a23ca8931")
  });
})
