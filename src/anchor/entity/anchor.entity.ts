import { Network } from "./network.entity";

export class Anchor {
    public id: number;
    public blockRoots: string[];
    public networks: Network[];
    public root: string;
    public status: string;

    constructor(
        id: number,
        blockRoots: string[],
        networks: Network[],
        root: string,
        status: string
    ) {
        this.id = id;
        this.blockRoots = blockRoots;
        this.networks = networks;
        this.root = root;
        this.status = status;
    }
}