import Hash from "./hash";

class Verifier {

    public static verify(proofHex: string[]): boolean {
        let proof: Uint8Array[] = [];
        proofHex.forEach(item => {
            proof.push(Uint8Array.from(Buffer.from(item, 'hex')));
        })

        let hash: Uint8Array;

        if (Verifier.getPath(proof[proof.length - 1], proof.length - 3)) {
            hash = Verifier.merge(proof[proof.length - 2], proof[proof.length - 1]);
        } else {
            hash = Verifier.merge(proof[proof.length - 1], proof[proof.length - 2]);
        }

        for (let i = proof.length - 3; i >= 1; --i) {            
            if (Verifier.getPath(proof[proof.length - 1], i - 1)) {
                hash = Verifier.merge(proof[i], hash);
            } else {
                hash = Verifier.merge(hash, proof[i]);
            }
        }

        let result = true;
        proof[0].forEach((value: number, index: number) => {
            if (value !== hash[index]) {
                result = false;
            }
        })

        return result;
    }

    private static merge(left: Uint8Array, right: Uint8Array): Uint8Array {
        let concat = new Uint8Array(left.length + right.length);
        concat.set(left);
        concat.set(right, left.length);

        return Hash.fromUint8Array(concat).getUint8ArrayHash();
    }

    private static getPath(key: Uint8Array, bit: number) {
        return (key[Math.floor(Math.abs(key.length - ((255-bit)/8) - 1))] & (1 << ((255-bit) % 8))) > 0;
    }
}

export default Verifier;