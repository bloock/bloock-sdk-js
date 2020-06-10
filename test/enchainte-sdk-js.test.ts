import { EnchainteClient, Hash } from "../src";

const mockAPIKey = "MockedAPIKeyOf64CharactersLong--MockedAPIKeyOf64CharactersLong";

describe("Index Tests", () => {
  it('Initializes sdk', () => {
    let client = new EnchainteClient(mockAPIKey);

    expect(client).toBeInstanceOf(EnchainteClient);
  });

  it('Initializes hash', () => {
    let hash = Hash.fromString("enchainte");

    expect(hash).toBeInstanceOf(Hash);
  });
})
