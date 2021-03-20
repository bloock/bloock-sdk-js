export class ProofRetrieveResponse {
    public nodes: string[];
    public depth: string;
    public bitmap: string;

    constructor(data: {
        nodes: string[],
        depth: string,
        bitmap: string
    }) {
        this.nodes = data.nodes;
        this.depth = data.depth;
        this.bitmap = data.bitmap;
    }
}