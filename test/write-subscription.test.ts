import Hash from "../src/utils/hash";
import Writer from "../src/write/writer";
import { API_URL } from '../src/utils/constants';
import axios from 'axios';

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
    let writerInstance = Writer.getInstance();

    expect(writerInstance).toBeInstanceOf(Writer);
  });

  it('should be singleton', () => {
    let writerInstance = Writer.getInstance();
    let secondWriterInstance = Writer.getInstance();

    expect(writerInstance).toBe(secondWriterInstance);
  });

  it('should callback when sended successfuly', done => {
    let writerInstance = Writer.getInstance();
    
    let promise = writerInstance.push(Hash.fromString("enchainte"));

    promise.then(res => {
      expect(res).toBe(true);
      done();
    });

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

    jest.runOnlyPendingTimers();
  });

  it('should callback when sended and failed', done => {
    let writerInstance = Writer.getInstance();
    
    let promise = writerInstance.push(Hash.fromString("enchainte"));

    promise.catch(err => {
      expect(err).toBe(false);
      done();
    });

    mockedAxios.post.mockRejectedValueOnce({ data: { hash: 'hash' }, status: 400 } as any);

    jest.runOnlyPendingTimers();
  });

  it('each pusher should recieve the callback if success', async () => {
    let writerInstance = Writer.getInstance();
    
    let promiseOne = writerInstance.push(Hash.fromString("enchainte1"));
    let promiseTwo = writerInstance.push(Hash.fromString("enchainte2"));

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

    jest.runOnlyPendingTimers();

    let promiseOneResult = await promiseOne;
    let promiseTwoResult = await promiseTwo;

    expect(promiseOneResult).toBe(true);
    expect(promiseTwoResult).toBe(true);
    
  });

  it('each pusher should recieve the callback if fails', async () => {
    expect.assertions(2);

    let writerInstance = Writer.getInstance();
    
    let promiseOne = writerInstance.push(Hash.fromString("enchainte1"));
    let promiseTwo = writerInstance.push(Hash.fromString("enchainte2"));

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
    let writerInstance = Writer.getInstance();

    const hash1 = Hash.fromString("enchainte1");
    const hash2 = Hash.fromString("enchainte2");
    
    writerInstance.push(hash1);
    writerInstance.push(hash2);

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

    jest.runOnlyPendingTimers();

    expect(mockedAxios.post).toBeCalledTimes(1);
    
  });

  it('should not trigger if no pushes', async () => {
    let writerInstance = Writer.getInstance();

    mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

    jest.runOnlyPendingTimers();

    expect(mockedAxios.post).toBeCalledTimes(0);   
  });
})
