export default class Config {
    public HOST = '';
    public WRITE_ENDPOINT = '';
    public PROOF_ENDPOINT = '';
    public FETCH_ENDPOINT = '';
    public CONTRACT_ADDRESS = '';
    public CONTRACT_ABI = '';
    public PROVIDER = '';
    public WRITE_INTERVAL = 1000;
    public CONFIG_INTERVAL = 10000;
    public WAIT_MESSAGE_INTERVAL_FACTOR = 2;
    public WAIT_MESSAGE_INTERVAL_DEFAULT = 1000;

    public constructor(config?: {
        HOST: string;
        WRITE_ENDPOINT: string;
        PROOF_ENDPOINT: string;
        FETCH_ENDPOINT: string;
        CONTRACT_ADDRESS: string;
        CONTRACT_ABI: string;
        PROVIDER: string;
        WRITE_INTERVAL: string;
        CONFIG_INTERVAL: string;
        WAIT_MESSAGE_INTERVAL_FACTOR: string;
        WAIT_MESSAGE_INTERVAL_DEFAULT: string;
    }) {
        if (config) {
            this.HOST = config.HOST;
            this.WRITE_ENDPOINT = config.WRITE_ENDPOINT;
            this.PROOF_ENDPOINT = config.PROOF_ENDPOINT;
            this.FETCH_ENDPOINT = config.FETCH_ENDPOINT;
            this.CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;
            this.CONTRACT_ABI = config.CONTRACT_ABI;
            this.PROVIDER = config.PROVIDER;
            this.WRITE_INTERVAL = parseInt(config.WRITE_INTERVAL);
            this.CONFIG_INTERVAL = parseInt(config.CONFIG_INTERVAL);
            this.WAIT_MESSAGE_INTERVAL_FACTOR = parseInt(config.WAIT_MESSAGE_INTERVAL_FACTOR);
            this.WAIT_MESSAGE_INTERVAL_DEFAULT = parseInt(config.WAIT_MESSAGE_INTERVAL_DEFAULT);
        }
    }
}
