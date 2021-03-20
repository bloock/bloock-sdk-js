import { injectable, inject } from "tsyringe";

import { Message } from "../../message/entity/message.entity";
import { Proof } from "../entity/proof.entity";
import { ProofRepository } from "../repository/proof.repository";
import { ProofService } from "./proof.service";

@injectable()
export class ProofServiceImpl implements ProofService {

    constructor(
        @inject("ProofRepository") private proofRepository: ProofRepository
    ) {}

    async retrieveProof(messages: Message[]): Promise<Proof> {
        let sorted = Message.sort(messages)

        return this.proofRepository.retrieveProof(sorted);
    }

    async verifyMessages(messages: Message[]): Promise<boolean> {
        let proof = await this.retrieveProof(messages);
        if (proof == null) {
            return false;
        }

        return this.verifyProof(proof);
    }

    async verifyProof(proof: Proof): Promise<boolean> {
        try {
            let root = this.proofRepository.verifyProof(proof);
            if (root == null) {
                return false;
            }

            return this.proofRepository.validateRoot(root);
        } catch (error) {
            return false;
        }
    }
}