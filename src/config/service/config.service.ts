import { ConfigEnv } from "../entity/config-env.entity";
import { Configuration } from "../entity/configuration.entity";

export interface ConfigService {
    setupEnvironment(environment: ConfigEnv): Configuration
    getConfiguration(): Configuration
    getApiBaseUrl(): string
}