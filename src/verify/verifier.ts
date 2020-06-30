import Hash from "../utils/hash";
import Utils from "../utils/utils";
import Web3Service from "../comms/web3.service";

class Verifier {

    public static verify(leaves: Uint8Array[], nodes: Uint8Array[], depth: Uint8Array, bitmap: Uint8Array): boolean {
        let proof: Uint8Array[] = [];
        let it_leaves = 0;
        let it_nodes = 0;
        let it_bitmap = 0;
        let curr_bit = 0;
        let stack: [Uint8Array,number][]= [];
        
        while (it_nodes < nodes.length-1 || it_leaves < leaves.length) {
            let bitmap_byte = bitmap[it_bitmap];
            let is_leaf = (bitmap[it_bitmap] & (1 << (7 - (curr_bit%8)))) > 0;
            let act_hash: Uint8Array;
            if (is_leaf) { act_hash = leaves[it_leaves];}
            else { act_hash = nodes[it_nodes];}
            let act_depth = depth[it_nodes + it_leaves];

            while (stack.length > 0 && (stack[stack.length-1][1] == act_depth)) {
                let last_hash = stack[stack.length-1][0];
                stack.pop();
                act_hash = Verifier.merge(last_hash, act_hash);
                act_depth -= 1;
            }
            stack.push([act_hash, act_depth]);

            if (is_leaf) { it_leaves += 1;}
            else { it_nodes += 1;}
            curr_bit = (curr_bit + 1) %8;
            if (curr_bit == 0) { it_bitmap += 1;}
        }
        return Verifier.compare_keys(stack[0][0], nodes[it_nodes]);    
    }

    private static merge(left: Uint8Array, right: Uint8Array): Uint8Array {
        let concat = new Uint8Array(left.length + right.length);
        concat.set(left);
        concat.set(right, left.length);

        return Hash.fromUint8Array(concat).getUint8ArrayHash();
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

export default Verifier;