import Message from './message';

export default class Proof {
    public leaves: Message[];
    public nodes: string[];
    public depth: string;
    public bitmap: string;
    public root: string;

    constructor(leaves: Message[], nodes: string[], depth: string, bitmap: string, root: string) {
        this.leaves = leaves;
        this.nodes = nodes;
        this.depth = depth;
        this.bitmap = bitmap;
        this.root = root;
    }

    public static isValid(proof: unknown): boolean {
        if (proof instanceof Proof) {
            return true;
        }

        return false;
    }
}
