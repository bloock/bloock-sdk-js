import { EnchainteClient, Hash } from "../src";

/**
 * Dummy test
 */
describe("Index Tests", () => {
  it('Initializes sdk', () => {
    let client = new EnchainteClient();

    expect(client).toBeInstanceOf(EnchainteClient);
  });

  it('Initializes hash', () => {
    let hash = Hash.fromString("enchainte");

    expect(hash).toBeInstanceOf(Hash);
  });
})
