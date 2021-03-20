import { AnchorRetrieveResponse } from "../entity/dto/anchor-retrieve-response.entity";

export interface AnchorRepository {
    getAnchor(anchor: number): Promise<AnchorRetrieveResponse>;
}