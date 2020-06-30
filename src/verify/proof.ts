import Hash from "../utils/hash";

export default class Proof {
    public leaves: Hash[];
    public nodes: string[];
    public depth: string;
    public bitmap: string;

    constructor(
        leaves: Hash[],
        nodes: string[],
        depth: string,
        bitmap: string
    ) {
        this.leaves = leaves;
        this.nodes = nodes;
        this.depth = depth;
        this.bitmap = bitmap;
    }
}