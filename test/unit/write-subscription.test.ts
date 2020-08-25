import Hash from '../../src/entity/hash';
import Writer from '../../src/writer';
import axios from 'axios';
import ConfigService from '../../src/service/config.service';
import configMock from '../mocks/config.mock';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.useFakeTimers();

const mockConfigService = ConfigService;
mockConfigService.getConfig = jest.fn();
(mockConfigService.getConfig as jest.Mock).mockReturnValue(configMock);

describe('Write Subscription Tests', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    it('Initializes', () => {
        const writerInstance = Writer.getInstance();

        expect(writerInstance).toBeInstanceOf(Writer);
    });

    it('should be singleton', () => {
        const writerInstance = Writer.getInstance();
        const secondWriterInstance = Writer.getInstance();

        expect(writerInstance).toBe(secondWriterInstance);
    });

    it('should callback when sended successfuly', done => {
        const writerInstance = Writer.getInstance();

        const promise = writerInstance.push(Hash.fromString('enchainte'));

        promise.then(res => {
            expect(res).toBe(true);
            done();
        });

        mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

        jest.runOnlyPendingTimers();
    });

    it('should callback when sended and failed', done => {
        const writerInstance = Writer.getInstance();

        const promise = writerInstance.push(Hash.fromString('enchainte'));

        promise.catch(err => {
            expect(err).toBeDefined();
            done();
        });

        mockedAxios.post.mockRejectedValueOnce({ data: { hash: 'hash' }, status: 400 } as any);

        jest.runOnlyPendingTimers();
    });

    it('each pusher should recieve the callback if success', async () => {
        const writerInstance = Writer.getInstance();

        const promiseOne = writerInstance.push(Hash.fromString('enchainte1'));
        const promiseTwo = writerInstance.push(Hash.fromString('enchainte2'));

        mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

        jest.runOnlyPendingTimers();

        const promiseOneResult = await promiseOne;
        const promiseTwoResult = await promiseTwo;

        expect(promiseOneResult).toBe(true);
        expect(promiseTwoResult).toBe(true);
    });

    it('each pusher should recieve the callback if fails', async () => {
        expect.assertions(2);

        const writerInstance = Writer.getInstance();
        const promiseOne = writerInstance.push(Hash.fromString('enchainte1'));
        const promiseTwo = writerInstance.push(Hash.fromString('enchainte2'));

        mockedAxios.post.mockRejectedValueOnce({ data: { hash: 'hash' }, status: 400 } as any);

        jest.runOnlyPendingTimers();

        try {
            await promiseOne;
        } catch (err) {
            expect(err).toBeDefined();
        }

        try {
            await promiseTwo;
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should call API once every second', async () => {
        const writerInstance = Writer.getInstance();

        const hash1 = Hash.fromString('enchainte1');
        const hash2 = Hash.fromString('enchainte2');

        writerInstance.push(hash1);
        writerInstance.push(hash2);

        mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

        jest.runOnlyPendingTimers();

        expect(mockedAxios.post).toBeCalledTimes(1);
    });

    it('should not trigger if no pushes', async () => {
        const writerInstance = Writer.getInstance();

        mockedAxios.post.mockResolvedValue({ data: { hash: 'hash' } } as any);

        jest.runOnlyPendingTimers();

        expect(mockedAxios.post).toBeCalledTimes(0);
    });
});
