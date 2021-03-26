import { container } from 'tsyringe';
import { mock } from 'jest-mock-extended';

import { Proof } from '../entity/proof.entity';
import { ProofRepository } from './proof.repository';
import { ConfigService } from '../../config/service/config.service';
import { HttpClient } from '../../infrastructure/http.client';
import { ProofRepositoryImpl } from './proof-impl.repository';
import { BlockchainClient } from '../../infrastructure/blockchain.client';

describe('Verifier Tests', () => {

    beforeAll(() => {
        container.registerInstance("ConfigService", mock<ConfigService>());
        container.registerInstance("HttpClient", mock<HttpClient>());
        container.registerInstance("BlockchainClient", mock<BlockchainClient>());
        container.register("ProofRepository", {
            useClass: ProofRepositoryImpl
        });
    });

    it('verifies proof 1', async () => {
        const leaves = ['72aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9'];
        const nodes = [
            '359b5206452a4ca5058129727fb48f0860a36c0afee0ec62baa874927e9d4b99',
            '707cb86e449cd3990c85fb3ae9ec967ee12b82f21eae9e6ea35180e6c331c3e8',
            '23950edeb3ca719e814d8b04d63d90d39327b49b7df5baf2f72305c1f2b260b7',
            '72aae7e86eb50f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9',
            '517e320992fb35553575750153992d6360268d04a1e4d9e2cae7e5c3736ac627',
        ];
        const depth = '000200030004000500050001';
        const bitmap = 'f4';
        const root = '6608fd2c5d9c28124b41d6e441d552ad811a51fc6fdae0f33aa64bf3f43ca699';

        let proofRepository = container.resolve<ProofRepository>("ProofRepository");
        expect(proofRepository.verifyProof(new Proof(leaves, nodes, depth, bitmap)).getHash()).toBe(root);
    });

    it('verifies proof 2', async () => {
        const leaves = [
            '82aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9',
            '92aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9',
        ];
        const nodes = [
            '285f570a90100fb94d5608b25d9e2b74bb58f068d495190f469aac5ef7ecf3c5',
            '8f0194b0986e0ea2d6e24df52f1fb3d44e421bce224383f7805f38dc772b3489',
        ];
        const depth = '0001000300030002';
        const bitmap = 'a0';
        const root = '264248bf767509da977f61d42d5723511b7af2781613b9119edcebb25a226976';

        let proofRepository = container.resolve<ProofRepository>("ProofRepository");
        expect(proofRepository.verifyProof(new Proof(leaves, nodes, depth, bitmap)).getHash()).toBe(root);
    });

    it('verifies proof 3', async () => {
        const leaves = [
            '3b7a824a1572e5c64bc280d97cc658bebbd7f85032bda98d478012335637e34c'
        ];
        const nodes = [
            '9bb9c0392509dbbb6cf8fecdff94c1c2175ceb2bbf1e4b8b527ff6ee8ec07908',
            '69a6183ca72fc154d589527a5eae58038497818c4e48c8496ee0093448a227d8',
            '4a11b9a8bcb62a6fa4104b0a01b5333e6636741c9683c0550365f06049f8f4ee',
            '3809cc631ac9ae3184784edf104c195716d1e0e2738c8390fdd0f290b3ea6487',
            'f22d28a9ae7db36bfe632939c0a6428edd4b109f1b616afb9c1ea31c8fd80a03',
            '6932c94926edabb0f95e0f26fec8b75863b6fd8d882e44629d6d3f449b3b1a83',
            '8af97658047a196a345f14aaedce43a7025b09481607511e31118ee718e2354a'
        ];
        const depth = '00010002000300040006000700070005';
        const bitmap = 'fb00';
        const root = '482353335a663158a869de9b3d46987caedec00d7581c3a0eb75054ba4eb04b3';

        let proofRepository = container.resolve<ProofRepository>("ProofRepository");
        expect(proofRepository.verifyProof(new Proof(leaves, nodes, depth, bitmap)).getHash()).toBe(root);
    });

    it('verifies proof 4', async () => {
        const leaves = ['72aae3286eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9'];
        const nodes: string[] = [];
        const depth = '0000';
        const bitmap = '00';
        const root = '72aae3286eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9';

        let proofRepository = container.resolve<ProofRepository>("ProofRepository");
        expect(proofRepository.verifyProof(new Proof(leaves, nodes, depth, bitmap)).getHash()).toBe(root);
    });
});
