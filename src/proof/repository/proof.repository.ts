import { Message } from "../../message/entity/message.entity";
import { Proof } from "../entity/proof.entity";

export interface ProofRepository {
    retrieveProof(messages: Message[]): Promise<Proof>;
    verifyProof(proof: Proof): Message;
    validateRoot(root: Message): Promise<boolean>;
}