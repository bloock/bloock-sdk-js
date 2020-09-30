import Message from './entity/message';
import Proof from './entity/proof';
import Utils from './utils/utils';

export default class Verifier {
    public static verify(proof: Proof): boolean {
        const leaves = proof.leaves.map(leaf => leaf.getUint8ArrayHash());
        const hashes = proof.nodes.map(node => Utils.hexToBytes(node));
        const depth = Utils.hexToBytes(proof.depth);
        const bitmap = Utils.hexToBytes(proof.bitmap);
        const root = Utils.hexToBytes(proof.root);

        let it_leaves = 0;
        let it_hashes = 0;
        const stack: [Uint8Array, number][] = [];

        while (it_hashes < hashes.length || it_leaves < leaves.length) {
            let act_depth = depth[it_hashes + it_leaves];
            let act_hash: Uint8Array;

            if ((bitmap[Math.floor((it_hashes + it_leaves) / 8)] & (1 << (7 - ((it_hashes + it_leaves) % 8)))) > 0) {
                act_hash = hashes[it_hashes];
                it_hashes += 1;
            } else {
                act_hash = leaves[it_leaves];
                it_leaves += 1;
            }
            while (stack.length > 0 && stack[stack.length - 1][1] == act_depth) {
                const last_hash = stack.pop();
                if (!last_hash) {
                    return false;
                }
                act_hash = Verifier.merge(last_hash[0], act_hash);
                act_depth -= 1;
            }
            stack.push([act_hash, act_depth]);
        }
        return Verifier.compare_keys(stack[0][0], root);
    }

    private static merge(left: Uint8Array, right: Uint8Array): Uint8Array {
        const concat = new Uint8Array(left.length + right.length);
        concat.set(left);
        concat.set(right, left.length);

        return Message.fromUint8Array(concat).getUint8ArrayHash();
    }

    private static compare_keys(left: Uint8Array, right: Uint8Array): boolean {
        let result = true;
        left.forEach((value: number, index: number) => {
            if (value !== right[index]) {
                result = false;
            }
        });
        return result;
    }
}
