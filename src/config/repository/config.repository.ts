import { ConfigEnv } from "../entity/config-env.entity";
import { Configuration } from "../entity/configuration.entity";

export interface ConfigRepository {
    fetchConfiguration(environment: ConfigEnv): Configuration
    getConfiguration(): Configuration
}