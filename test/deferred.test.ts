import Deferred from "../src/utils/deferred";

/**
 * Dummy test
 */
describe("Deferred Tests", () => {
  it('Initializes', () => {
    let deferred = new Deferred();

    expect(deferred).toBeInstanceOf(Deferred);
  });

  it('Triggers promise resolve', done => {
    let deferred = new Deferred();

    deferred.getPromise().then(res => {
      expect(res).toBe(true);
      done();
    });

    deferred.resolve(true);
  });

  it('Triggers promise reject', done => {
    let deferred = new Deferred();

    deferred.getPromise().catch(res => {
      expect(res).toBe(false);
      done();
    });

    deferred.reject(false);
  });
})
