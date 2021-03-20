import { injectable, inject } from "tsyringe";
import { ConfigService } from "../../config/service/config.service";
import { HttpClient } from "../../infrastructure/http.client";

import { AnchorRetrieveResponse } from "../entity/dto/anchor-retrieve-response.entity";
import { AnchorRepository } from "./anchor.repository";

@injectable()
export class AnchorRepositoryImpl implements AnchorRepository {

    constructor(
        @inject("HttpClient") private httpClient: HttpClient,
        @inject("ConfigService") private configService: ConfigService
    ) {}

    getAnchor(anchor: number): Promise<AnchorRetrieveResponse> {
        let url = `${this.configService.getApiBaseUrl()}/anchors/${anchor}`;
        return this.httpClient.get(url);
    }

}