import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import WriteSubscription from "../src/write-subscription"
import Hash from "../src/hash";
import axios from 'axios';
import { API_URL } from '../src/constants';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.useFakeTimers();

/**
 * Dummy test
 */
describe("Write Subscription Tests", () => {

  beforeAll(() => {
    jest.useFakeTimers();
  })

  beforeEach(() => {
    mockedAxios.post.mockClear();
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

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

    jest.runOnlyPendingTimers();
  });

  it('should callback when sended and failed', done => {
    let writeSubscription = WriteSubscription.getInstance();
    
    let promise = writeSubscription.push(Hash.fromString("enchainte"));

    promise.catch(err => {
      expect(err).toBe(false);
      done();
    });

    mockedAxios.post.mockRejectedValueOnce({ data: { hash: 'hash' }, status: 400 } as any);

    jest.runOnlyPendingTimers();
  });

  it('each pusher should recieve the callback if success', async () => {
    let writeSubscription = WriteSubscription.getInstance();
    
    let promiseOne = writeSubscription.push(Hash.fromString("enchainte1"));
    let promiseTwo = writeSubscription.push(Hash.fromString("enchainte2"));

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

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

    mockedAxios.post.mockRejectedValueOnce({ data: { hash: 'hash' }, status: 400 } as any);

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

  it('should call API once every second', async () => {
    let writeSubscription = WriteSubscription.getInstance();

    const hash1 = Hash.fromString("enchainte1");
    const hash2 = Hash.fromString("enchainte2");
    
    writeSubscription.push(hash1);
    writeSubscription.push(hash2);

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

    jest.runOnlyPendingTimers();

    expect(mockedAxios.post).toBeCalledWith(`${API_URL}/send/bulk`, { messages: [hash1.getHash(), hash2.getHash()] })
    expect(mockedAxios.post).toBeCalledTimes(1);
    
  });

  it('should not trigger if no pushes', async () => {
    let writeSubscription = WriteSubscription.getInstance();

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

    jest.runOnlyPendingTimers();

    expect(mockedAxios.post).toBeCalledTimes(0);   
  });
})
