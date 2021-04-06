import { Message } from "../../message/entity/message.entity";
import { Proof } from "../entity/proof.entity";

export interface ProofService {
    retrieveProof(messages: Message[]): Promise<Proof>;
    verifyMessages(messages: Message[]): Promise<number>;
    verifyProof(proof: Proof): Promise<number>;
}