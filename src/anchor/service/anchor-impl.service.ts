import { injectable, inject } from "tsyringe";

import { ConfigRepository } from "../../config/repository/config.repository";
import { Utils } from "../../shared/utils";
import { Anchor } from "../entity/anchor.entity";
import { AnchorNotFoundException } from "../entity/exception/anchor-not-found.exception";
import { AnchorRepository } from "../repository/anchor.repository";
import { AnchorService } from "./anchor.service";

@injectable()
export class AnchorServiceImpl implements AnchorService {

    constructor(
        @inject("AnchorRepository") private anchorRepository: AnchorRepository,
        @inject("ConfigRepository") private configRepository: ConfigRepository
    ) {}

    async getAnchor(anchorId: number): Promise<Anchor> {
        let anchor = await this.anchorRepository.getAnchor(anchorId);

        if (anchor == null) {
            throw new AnchorNotFoundException()
        }

        return new Anchor(
            anchor.anchor_id,
            anchor.block_roots,
            anchor.networks,
            anchor.root,
            anchor.status
        )
    }
    async waitAnchor(anchorId: number): Promise<Anchor> {
        let attempts = 0;
        let anchor = null;

        while (anchor == null) {
            try {
                let response = await this.anchorRepository.getAnchor(anchorId);
                if (response != null) {
                    let tempAnchor = new Anchor(
                        response.anchor_id,
                        response.block_roots,
                        response.networks,
                        response.root,
                        response.status
                    );

                    if (tempAnchor.status === "Success") {
                        anchor = tempAnchor;
                        break;
                    }
                }
            } catch (error) { }

            Utils.sleep(
                this.configRepository.getConfiguration().WAIT_MESSAGE_INTERVAL_DEFAULT +
                attempts * this.configRepository.getConfiguration().WAIT_MESSAGE_INTERVAL_FACTOR
            )

            attempts += 1
        }

        return anchor;

    }
}