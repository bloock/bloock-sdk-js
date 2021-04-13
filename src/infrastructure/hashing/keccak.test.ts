import { HashingClient } from '../hashing.client';
import { Utils } from '../../shared/utils';
import { Keccak } from './keccak';


describe('Keccak Tests', () => {
    it('Keccak test 1', async () => {
        const data = 'Test Data';
        
        const hashingAlgorithm: HashingClient = new Keccak();
        expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual("e287462a142cd6237de5a89891ad82065f6aca6644c161b1a61c933c5d26117a")
    });

    it('Keccak test 2', async () => {
        const data = 'Enchainte';
        
        const hashingAlgorithm: HashingClient = new Keccak();
        expect(hashingAlgorithm.generateHash(Utils.stringToBytes(data))).toEqual("d4144e508be94b010bd69d7a86837475b7c020b7abfb57ec164406f227e254f8")
    });
});
