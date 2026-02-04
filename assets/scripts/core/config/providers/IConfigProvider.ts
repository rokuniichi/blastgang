import { IConfig } from "../IConfig";

export interface IConfigProvider<TConfig extends IConfig> {
    load(): Promise<void>;
    get(): TConfig;
}