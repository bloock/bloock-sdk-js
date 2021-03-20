import { injectable, inject } from "tsyringe";

import { ConfigEnv } from "../entity/config-env.entity";
import { Configuration } from "../entity/configuration.entity";
import { ConfigData } from "./config-data";
import { ConfigRepository } from "./config.repository";

@injectable()
export class ConfigRepositoryImpl implements ConfigRepository {

    constructor(
        @inject("ConfigData") private configData: ConfigData
    ) {}

    fetchConfiguration(environment: ConfigEnv): Configuration {
        switch (environment) {
            case ConfigEnv.PROD:
                return this.configData.setConfiguration();
            case ConfigEnv.TEST:
                return this.configData.setTestConfiguration();
            default:
                return this.configData.setConfiguration();
        }
    }
    getConfiguration(): Configuration {
        return this.configData.getConfiguration();
    }

}