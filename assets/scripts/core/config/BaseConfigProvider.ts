import { IConfigProvider as IConfigProvider } from "./IConfigProvider";
import { assertNotNull } from "../utils/assert";
import { IConfig } from "./IConfig";

export abstract class BaseConfigProvider<TConfig extends IConfig> implements IConfigProvider<TConfig> {
    protected config!: TConfig;

    public abstract load(): Promise<void>;

    public get(): TConfig {
        assertNotNull(this.config, this, "config");
        return this.config;
    }
}