import Hash from "../src/utils/hash";
import Verifier from "../src/verify/verifier";

/**
 * Dummy test
 */
describe("Verifier Tests", () => {
  it('verifies proof 1', async () => {
    //proof form test_verify_multiproof_4_leaves_pairs_X_0_X_0
    const leaves: Uint8Array[] = [
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      new Uint8Array([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2])
    ];
    const nodes: Uint8Array[] = [
      new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
      new Uint8Array([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]),
      new Uint8Array([236, 45, 107, 94, 128, 193, 173, 148, 130, 182, 250, 30, 47, 54, 61, 144, 13, 74, 126, 158, 114, 161, 132, 252, 253, 103, 236, 44, 168, 232, 117, 234])  
    ];
    const depth: Uint8Array = new Uint8Array([1,1,1,1,0]);
    const bitmap: Uint8Array = new Uint8Array([160]);

    expect(await Verifier.verify(leaves, nodes, depth, bitmap)).toBe(true);
  });

  it('verifies proof 2', async () => {
    //proof form test_verify_multiproof_4_leaves_pairs_0_X_0_X
    const leaves: Uint8Array[] = [
      new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
      new Uint8Array([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3])
    ];
    const nodes: Uint8Array[] = [
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      new Uint8Array([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]),
      new Uint8Array([236, 45, 107, 94, 128, 193, 173, 148, 130, 182, 250, 30, 47, 54, 61, 144, 13, 74, 126, 158, 114, 161, 132, 252, 253, 103, 236, 44, 168, 232, 117, 234])  
    ];
    const depth: Uint8Array = new Uint8Array([1,1,1,1,0]);
    const bitmap: Uint8Array = new Uint8Array([80]);

    expect(await Verifier.verify(leaves, nodes, depth, bitmap)).toBe(true);
  });

  it('verifies proof 3', async () => {
    //proof form test_verify_multiproof_4_leaves_pairs_0_0_X_X
    const leaves: Uint8Array[] = [
      new Uint8Array([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]),
      new Uint8Array([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3])
    ];
    const nodes: Uint8Array[] = [
      new Uint8Array([3, 127, 45, 161, 237, 218, 238, 67, 106, 133, 220, 204, 7, 34, 69, 228, 123, 196, 15, 21, 154, 156, 67, 94, 39, 81, 41, 150, 54, 177, 239, 3]),
      new Uint8Array([236, 45, 107, 94, 128, 193, 173, 148, 130, 182, 250, 30, 47, 54, 61, 144, 13, 74, 126, 158, 114, 161, 132, 252, 253, 103, 236, 44, 168, 232, 117, 234])  
    ];
    const depth: Uint8Array = new Uint8Array([0,1,1,0]);
    const bitmap: Uint8Array = new Uint8Array([96]);

    expect(await Verifier.verify(leaves, nodes, depth, bitmap)).toBe(true);
  });

  it('verifies proof 4', async () => {
    //proof form test_verify_multiproof_4_leaves_pairs_X_0_0_X
    const leaves: Uint8Array[] = [
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      new Uint8Array([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3])
    ];
    const nodes: Uint8Array[] = [
      new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
      new Uint8Array([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]),
      new Uint8Array([236, 45, 107, 94, 128, 193, 173, 148, 130, 182, 250, 30, 47, 54, 61, 144, 13, 74, 126, 158, 114, 161, 132, 252, 253, 103, 236, 44, 168, 232, 117, 234])  
    ];
    const depth: Uint8Array = new Uint8Array([1,1,1,1,0]);
    const bitmap: Uint8Array = new Uint8Array([144]);

    expect(await Verifier.verify(leaves, nodes, depth, bitmap)).toBe(true);
  });

  it('verifies proof 5', async () => {
    //proof form test_verify_multiproof_4_leaves_pairs_0_X_X_0
    const leaves: Uint8Array[] = [
      new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
      new Uint8Array([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2])
    ];
    const nodes: Uint8Array[] = [
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      new Uint8Array([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]),
      new Uint8Array([236, 45, 107, 94, 128, 193, 173, 148, 130, 182, 250, 30, 47, 54, 61, 144, 13, 74, 126, 158, 114, 161, 132, 252, 253, 103, 236, 44, 168, 232, 117, 234])  
    ];
    const depth: Uint8Array = new Uint8Array([1,1,1,1,0]);
    const bitmap: Uint8Array = new Uint8Array([96]);

    expect(await Verifier.verify(leaves, nodes, depth, bitmap)).toBe(true);
  });
})
