/* eslint-disable array-element-newline */
import Verifier from '../../src/verifier';
import Proof from '../../src/entity/proof';
import Hash from '../../src/entity/hash';

describe('Verifier Tests', () => {
    it('verifies proof 1', async () => {
        const leaves = [Hash.fromHash('72aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9')];
        const nodes = [
            '359b5206452a4ca5058129727fb48f0860a36c0afee0ec62baa874927e9d4b99',
            '707cb86e449cd3990c85fb3ae9ec967ee12b82f21eae9e6ea35180e6c331c3e8',
            '23950edeb3ca719e814d8b04d63d90d39327b49b7df5baf2f72305c1f2b260b7',
            '72aae7e86eb50f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9',
            '517e320992fb35553575750153992d6360268d04a1e4d9e2cae7e5c3736ac627',
        ];
        const depth = '020304050501';
        const bitmap = 'f4';
        const root = '6608fd2c5d9c28124b41d6e441d552ad811a51fc6fdae0f33aa64bf3f43ca699';

        expect(Verifier.verify(new Proof(leaves, nodes, depth, bitmap, root))).toBe(true);
    });

    it('verifies proof 2', async () => {
        const leaves = [
            Hash.fromHash('82aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9'),
            Hash.fromHash('92aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9'),
        ];
        const nodes = [
            '285f570a90100fb94d5608b25d9e2b74bb58f068d495190f469aac5ef7ecf3c5',
            '8f0194b0986e0ea2d6e24df52f1fb3d44e421bce224383f7805f38dc772b3489',
        ];
        const depth = '01030302';
        const bitmap = 'a0';
        const root = '264248bf767509da977f61d42d5723511b7af2781613b9119edcebb25a226976';

        expect(Verifier.verify(new Proof(leaves, nodes, depth, bitmap, root))).toBe(true);
    });

    it('verifies proof 3', async () => {
        const leaves = [
            Hash.fromHash('82aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9'),
            Hash.fromHash('92aae7e86eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9'),
        ];
        const nodes = [
            '285f570a90110fb94d5608b25d9e2b74bb58f068d495190f469aac5ef7ecf3c5',
            '8f0194b0986e0ea2d6e24df52f1fb3d44e421bce224383f7805f38dc772b3489',
        ];
        const depth = '01030102';
        const bitmap = 'f0';
        const root = '264248bf767509da977f61d42d5723511b7af2781613b9119edcebb25a226976';

        expect(Verifier.verify(new Proof(leaves, nodes, depth, bitmap, root))).toBe(false);
    });

    it('verifies proof 4', async () => {
        const leaves = [Hash.fromHash('72aae3286eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9')];
        const nodes: string[] = [];
        const depth = '00';
        const bitmap = '00';
        const root = '72aae3286eb51f61a620831320475d9d61cbd52749dbf18fa942b1b97f50aee9';

        expect(Verifier.verify(new Proof(leaves, nodes, depth, bitmap, root))).toBe(true);
    });
});
