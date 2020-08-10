import Deferred from '../src/utils/deferred';

describe('Deferred Tests', () => {
    it('Initializes', () => {
        const deferred = new Deferred();

        expect(deferred).toBeInstanceOf(Deferred);
    });

    it('Triggers promise resolve', done => {
        const deferred = new Deferred();

        deferred.getPromise().then(res => {
            expect(res).toBe(true);
            done();
        });

        deferred.resolve(true);
    });

    it('Triggers promise reject', done => {
        const deferred = new Deferred();

        deferred.getPromise().catch(res => {
            expect(res).toBe(false);
            done();
        });

        deferred.reject(false);
    });
});
