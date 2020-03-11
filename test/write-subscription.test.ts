import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import WriteSubscription from "../src/write-subscription"
import Hash from "../src/hash";

jest.useFakeTimers();

/**
 * Dummy test
 */
describe("Write Subscription Tests", () => {

  beforeAll(() => {
    jest.useFakeTimers();
    enableFetchMocks();
  })

  it('Initializes', () => {
    let writeSubscription = WriteSubscription.getInstance();

    expect(writeSubscription).toBeInstanceOf(WriteSubscription);
  });

  it('should be singleton', () => {
    let writeSubscription = WriteSubscription.getInstance();
    let secondWriteSubscription = WriteSubscription.getInstance();

    expect(writeSubscription).toBe(secondWriteSubscription);
  });

  it('should callback when sended successfuly', done => {
    let writeSubscription = WriteSubscription.getInstance();
    
    let promise = writeSubscription.push(Hash.fromString("enchainte"));

    promise.then(res => {
      expect(res).toBe(true);
      done();
    });

    fetch.mockResponseOnce(JSON.stringify({ hash: 'hash' }))

    jest.runOnlyPendingTimers();
  });

  it('should callback when sended and failed', done => {
    let writeSubscription = WriteSubscription.getInstance();
    
    let promise = writeSubscription.push(Hash.fromString("enchainte"));

    promise.catch(err => {
      expect(err).toBe(false);
      done();
    });

    fetch.mockResponseOnce(JSON.stringify(null), { status: 400 });

    jest.runOnlyPendingTimers();
  });

  it('each pusher should recieve the callback if success', async () => {
    let writeSubscription = WriteSubscription.getInstance();
    
    let promiseOne = writeSubscription.push(Hash.fromString("enchainte1"));
    let promiseTwo = writeSubscription.push(Hash.fromString("enchainte2"));

    fetch.mockResponseOnce(JSON.stringify({ hash: 'hash' }));

    jest.runOnlyPendingTimers();

    let promiseOneResult = await promiseOne;
    let promiseTwoResult = await promiseTwo;

    expect(promiseOneResult).toBe(true);
    expect(promiseTwoResult).toBe(true);
    
  });

  it('each pusher should recieve the callback if fails', async () => {
    expect.assertions(2);

    let writeSubscription = WriteSubscription.getInstance();
    
    let promiseOne = writeSubscription.push(Hash.fromString("enchainte1"));
    let promiseTwo = writeSubscription.push(Hash.fromString("enchainte2"));

    fetch.mockResponseOnce(JSON.stringify(null), { status: 400 });

    jest.runOnlyPendingTimers();

    try {
      await promiseOne;
    } catch (err) {
      expect(err).toBe(false);
    }

    try {
      await promiseTwo;
    } catch (err) {
      expect(err).toBe(false);
    }
  });
})
