import Message from './message';

export default class Proof {
    public leaves: Message[];
    public nodes: string[];
    public depth: string;
    public bitmap: string;
    
    constructor(leaves: Message[], nodes: string[], depth: string, bitmap: string) {
        this.leaves = leaves;
        this.nodes = nodes;
        this.depth = depth;
        this.bitmap = bitmap;
    }

    public static isValid(proof: unknown): boolean {
        if (proof instanceof Proof) {
            return true;
        }

        return false;
    }
}
