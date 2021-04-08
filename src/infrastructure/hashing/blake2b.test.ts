import { container } from 'tsyringe';
import { mock } from 'jest-mock-extended';
import { HashingClient } from '../hashing.client';
import { Blake2b } from './blake2b';
import { Utils } from '../../shared/utils';


describe('Blake2b Tests', () => {
    it('blake2b test 1', async () => {
        const data = 'Test Data';
        
        const hashingAlgorithm: HashingClient = new Blake2b();
        expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual("7edb091de5d2cad1e65f9c124d3f3fda6895ec37b1bb0271aad78df6417a01e2")
    });

    it('blake2b test 2', async () => {
        const data = 'Enchainte';
        
        const hashingAlgorithm: HashingClient = new Blake2b();
        expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual("95b3e82e32782b9706afadbdb95ea6a690f603a6694db0935c8248185c28e92d")
    });
});
