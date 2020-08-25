import CryptoJS from 'crypto-js';
import axios, { AxiosRequestConfig } from 'axios';
import Config from '../entity/config';

export default class ConfigService {
    private ready: Promise<string>;

    private static config: Config;
    private ENVIRONMENT: 'PROD' | 'TEST' = 'PROD';

    private ENDPOINT = 'enchainte-config.azconfig.io';
    private CREDENTIAL = 'ihs8-l9-s0:JPRPUeiXJGsAzFiW9WDc';
    private SECRET = '1UA2dijC0SIVyrPKUKG0gT0oXxkVaMrUfJuXkLr+i0c=';

    public constructor() {
        this.ready = new Promise(async (resolve, reject) => {
            try {
                await this.fetchConfig();
                if (ConfigService.getConfig()) {
                    resolve();
                } else {
                    reject('Could not fetch configuration');
                }
            } catch (err) {
                reject('Could not fetch configuration');
            }
        });
    }

    public onReady(): Promise<string> {
        return this.ready;
    }

    public setTestEnvironment(isTest: boolean): void {
        if (isTest) this.ENVIRONMENT = 'TEST';
        else this.ENVIRONMENT = 'PROD';
    }

    public static getConfig(): Config {
        return ConfigService.config;
    }

    private async fetchConfig() {
        const path = `/kv?key=SDK_*&label=${this.ENVIRONMENT}`;
        const options: AxiosRequestConfig = {
            headers: this.getAuthHeaders('GET', path, undefined),
        };
        try {
            const res = await axios.get(`https://${this.ENDPOINT}${path}`, options);

            if (res.data && res.data.items) {
                const response = res.data.items;
                ConfigService.config = new Config({
                    HOST: this.getConfigKey(response, 'SDK_HOST'),
                    WRITE_ENDPOINT: this.getConfigKey(response, 'SDK_WRITE_ENDPOINT'),
                    PROOF_ENDPOINT: this.getConfigKey(response, 'SDK_PROOF_ENDPOINT'),
                    FETCH_ENDPOINT: this.getConfigKey(response, 'SDK_FETCH_ENDPOINT'),
                    CONTRACT_ADDRESS: this.getConfigKey(response, 'SDK_CONTRACT_ADDRESS'),
                    CONTRACT_ABI: this.getConfigKey(response, 'SDK_CONTRACT_ABI'),
                    PROVIDER: this.getConfigKey(response, 'SDK_PROVIDER'),
                    WRITE_INTERVAL: this.getConfigKey(response, 'SDK_WRITE_INTERVAL'),
                    CONFIG_INTERVAL: this.getConfigKey(response, 'SDK_CONFIG_INTERVAL'),
                });

                setTimeout(() => {
                    this.fetchConfig();
                }, parseInt(ConfigService.config.CONFIG_INTERVAL));
            } else {
                throw 'Bad config response';
            }
        } catch (error) {
            setTimeout(() => {
                this.fetchConfig();
            }, 10000);
        }
    }

    private getConfigKey(list: { key: string; value: string }[], key: string): string {
        const filter = list.filter(item => item.key == key);
        if (filter && filter.length > 0) {
            return filter[0].value;
        }

        return '';
    }

    private getAuthHeaders(method: string, url: string, body: any) {
        const verb = method.toUpperCase();
        const utcNow = new Date().toUTCString();
        const contentHash = CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64);

        // SignedHeaders
        const signedHeaders = 'x-ms-date;host;x-ms-content-sha256';

        // String-To-Sign
        const stringToSign = verb + '\n' + url + '\n' + utcNow + ';' + this.ENDPOINT + ';' + contentHash;

        // Signature
        const signature = CryptoJS.HmacSHA256(stringToSign, CryptoJS.enc.Base64.parse(this.SECRET)).toString(
            CryptoJS.enc.Base64,
        );

        return {
            'x-ms-date': utcNow,
            'x-ms-content-sha256': contentHash,
            Authorization: `HMAC-SHA256 Credential=${this.CREDENTIAL}&SignedHeaders=${signedHeaders}&Signature=${signature}`,
        };
    }
}
