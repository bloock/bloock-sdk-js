import { EnchainteClient, Web3Service } from '../../src';
import Message from '../../src/entity/message';
import Writer from '../../src/writer';

jest.mock('axios');
import axios from 'axios';
import Proof from '../../src/entity/proof';
import ApiService from '../../src/service/api.service';
import Verifier from '../../src/verifier';
import MessageReceipt from '../../src/entity/message-receipt';
import ConfigService from '../../src/service/config.service';
import configMock from '../mocks/config.mock';

const mockAPIKey = 'MockedAPIKeyOf64CharactersLong--MockedAPIKeyOf64CharactersLong';

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockConfigService = ConfigService;
mockConfigService.getConfig = jest.fn();
(mockConfigService.getConfig as jest.Mock).mockReturnValue(configMock);

const subscription = Writer.getInstance();
subscription.push = jest.fn();

describe('Enchainte SDK Tests', () => {
    beforeEach(() => {
        mockedAxios.get.mockClear();
        (subscription.push as jest.Mock).mockClear();
    });

    it('initializes', () => {
        expect(new EnchainteClient(mockAPIKey)).toBeInstanceOf(EnchainteClient);
    });

    describe('Write function Tests', () => {
        it('is successful', done => {
            const client = new EnchainteClient(mockAPIKey);

            (subscription.push as jest.Mock).mockResolvedValueOnce(true);

            client.sendMessage(Message.fromString('enchainte')).then(response => {
                expect((subscription.push as jest.Mock).mock.calls.length).toBe(1);
                expect(response).toBe(true);
                done();
            });
        });

        it('handle error', done => {
            const client = new EnchainteClient(mockAPIKey);

            (subscription.push as jest.Mock).mockResolvedValueOnce(false);

            client.sendMessage(Message.fromString('enchainte')).then(response => {
                expect((subscription.push as jest.Mock).mock.calls.length).toBe(1);
                expect(response).toBe(false);
                done();
            });
        });

        it('handle null input', done => {
            const client = new EnchainteClient(mockAPIKey);

            client.sendMessage(null).catch(error => {
                expect((subscription.push as jest.Mock).mock.calls.length).toBe(0);
                expect(error).toBeDefined();
                done();
            });
        });

        it('handle invalid hash', done => {
            const client = new EnchainteClient(mockAPIKey);

            (subscription.push as jest.Mock).mockResolvedValueOnce(false);

            client.sendMessage(Message.fromHash('enchainte')).catch(error => {
                expect((subscription.push as jest.Mock).mock.calls.length).toBe(0);
                expect(error).toBeDefined();
                done();
            });
        });
    });

    describe('Get proof Tests', () => {
        it('is successful', done => {
            const client = new EnchainteClient(mockAPIKey);

            const mockLeaves = [
                Message.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1'),
                Message.fromHash('5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434'),
            ];

            const mockRawProof = {
                nodes: [
                    '95be11f4984e0b6e15f100e4eb4476d54a716f47bfdbd606f85367f3867e9836',
                    '9b6c0696bc6c51d6f99b8fdc949c06eaaa0b6af7bee2564d04708e5dc2e262d8',
                    '5ac607f2a9ee295d8401e913478b8e04a729ddcca14a3a84c76fc2ae9105e6cf',
                    '9abd6230520456bea19a81777fb2ccf222bf12666c67babca72bf7cfd20a3500',
                    '6ce6c3c28598e82123a070613d086119efc753bc439e88047c35fc156d645b7a',
                ],
                depth: '02080c0d1012141413110f0e0b0a0907060504030100',
                bitmap: '020000',
            };

            const mockProof = new Proof(
                mockLeaves,
                mockRawProof.nodes,
                mockRawProof.depth,
                mockRawProof.bitmap,
            );

            const apiServiceMock = ApiService;
            apiServiceMock.getProof = jest.fn();
            (apiServiceMock.getProof as jest.Mock).mockResolvedValueOnce(mockProof);

            client.getProof(mockLeaves).then(res => {
                expect(res.leaves).toBeDefined();
                expect(res.nodes).toBeDefined();
                expect(res.depth).toBeDefined();
                expect(res.bitmap).toBeDefined();
                done();
            });
        });

        it('handle error', done => {
            const client = new EnchainteClient(mockAPIKey);

            const apiServiceMock = ApiService;
            apiServiceMock.getProof = jest.fn();
            (apiServiceMock.getProof as jest.Mock).mockRejectedValueOnce(false);

            const mockLeaves = [
                Message.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1'),
                Message.fromHash('5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434'),
            ];

            client.getProof(mockLeaves).catch(error => {
                expect((apiServiceMock.getProof as jest.Mock).mock.calls.length).toBe(1);
                expect(error).toBeDefined();
                done();
            });
        });

        it('handle null input', done => {
            const client = new EnchainteClient(mockAPIKey);

            const apiServiceMock = ApiService;
            apiServiceMock.getProof = jest.fn();

            client.getProof(null).catch(error => {
                expect((apiServiceMock.getProof as jest.Mock).mock.calls.length).toBe(0);
                expect(error).toBeDefined();
                done();
            });
        });
    });

    describe('Verify proof Tests', () => {
        it('Verify function success - true', async () => {
            const client = new EnchainteClient(mockAPIKey);

            const mockLeaves = [
                Message.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1'),
                Message.fromHash('5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434'),
            ];

            const mockRawProof = {
                nodes: [
                    '95be11f4984e0b6e15f100e4eb4476d54a716f47bfdbd606f85367f3867e9836',
                    '9b6c0696bc6c51d6f99b8fdc949c06eaaa0b6af7bee2564d04708e5dc2e262d8',
                    '5ac607f2a9ee295d8401e913478b8e04a729ddcca14a3a84c76fc2ae9105e6cf',
                ],
                depth: '02080c0d1012141413110f0e0b0a0907060504030100',
                bitmap: '020000',
            };

            const mockProof = new Proof(
                mockLeaves,
                mockRawProof.nodes,
                mockRawProof.depth,
                mockRawProof.bitmap,
            );

            const verifierMock = Verifier;
            verifierMock.verify = jest.fn();
            (verifierMock.verify as jest.Mock).mockReturnValueOnce(Message.fromHash("5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434"));

            const web3ServiceMock = Web3Service;
            web3ServiceMock.validateRoot = jest.fn();
            (web3ServiceMock.validateRoot as jest.Mock).mockReturnValueOnce(true);

            const valid = await client.verifyProof(mockProof);
            expect((verifierMock.verify as jest.Mock).mock.calls.length).toBe(1);
            expect(valid).toBe(true);
        });

        it('Verify function success - false', async () => {
            const client = new EnchainteClient(mockAPIKey);

            const mockLeaves = [
                Message.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1'),
                Message.fromHash('5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434'),
            ];

            const mockRawProof = {
                nodes: [
                    '95be11f4984e0b6e15f100e4eb4476d54a716f47bfdbd606f85367f3867e9836',
                    '9b6c0696bc6c51d6f99b8fdc949c06eaaa0b6af7bee2564d04708e5dc2e262d8',
                    '5ac607f2a9ee295d8401e913478b8e04a729ddcca14a3a84c76fc2ae9105e6cf',
                ],
                depth: '02080c0d1012141413110f0e0b0a0907060504030100',
                bitmap: '020000',
            };

            const mockProof = new Proof(
                mockLeaves,
                mockRawProof.nodes,
                mockRawProof.depth,
                mockRawProof.bitmap,
            );

            const verifierMock = Verifier;
            verifierMock.verify = jest.fn();
            (verifierMock.verify as jest.Mock).mockReturnValueOnce(Message.fromHash('5cd53f8367e1892c4f25dc9b5ddf28c7a1a27f489336a9537a43555819e4f434'));

            const web3ServiceMock = Web3Service;
            web3ServiceMock.validateRoot = jest.fn();
            (web3ServiceMock.validateRoot as jest.Mock).mockReturnValueOnce(false);

            const valid = await client.verifyProof(mockProof);
            expect((verifierMock.verify as jest.Mock).mock.calls.length).toBe(1);
            expect(valid).toBe(false);
        });

        it('Verify function error', async () => {
            const client = new EnchainteClient(mockAPIKey);

            const verifierMock = Verifier;
            verifierMock.verify = jest.fn();

            const valid = await client.verifyProof(null);
            expect((verifierMock.verify as jest.Mock).mock.calls.length).toBe(0);
            expect(valid).toBe(false);
        });
    });

    describe('Get message status Tests', () => {
        it('is successful', done => {
            const client = new EnchainteClient(mockAPIKey);

            const mockLeaves = [Message.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1')];

            const mockMessage = [
                new MessageReceipt({
                    root: '0f5c62817a529e0610d1fbf5c999bd53188f7f6958e4fb3aadd4a451e34bdc64',
                    message: '5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1',
                    tx_hash: '0xa46a26ba75af77fb778e88e202fca34875d6b1b0fc717bb00082b913ac08037b',
                    status: 'success',
                    error: 0,
                }),
            ];

            const apiServiceMock = ApiService;
            apiServiceMock.getMessages = jest.fn();
            (apiServiceMock.getMessages as jest.Mock).mockResolvedValueOnce(mockMessage);

            client.getMessages(mockLeaves).then(res => {
                expect((apiServiceMock.getMessages as jest.Mock).mock.calls.length).toBe(1);
                expect(Array.isArray(res)).toBeTruthy();
                done();
            });
        });

        it('handle error', done => {
            const client = new EnchainteClient(mockAPIKey);

            const mockLeaves = [Message.fromHash('5ac706bdef87529b22c08646b74cb98baf310a46bd21ee420814b04c71fa42b1')];

            const apiServiceMock = ApiService;
            apiServiceMock.getMessages = jest.fn();
            (apiServiceMock.getMessages as jest.Mock).mockRejectedValueOnce(false);

            client.getMessages(mockLeaves).catch(error => {
                expect((apiServiceMock.getMessages as jest.Mock).mock.calls.length).toBe(1);
                expect(error).toBeDefined();
                done();
            });
        });

        it('handle null input', done => {
            const client = new EnchainteClient(mockAPIKey);

            const apiServiceMock = ApiService;
            apiServiceMock.getMessages = jest.fn();

            client.getMessages(null).catch(error => {
                expect((apiServiceMock.getMessages as jest.Mock).mock.calls.length).toBe(0);
                expect(error).toBeDefined();
                done();
            });
        });
    });
});
