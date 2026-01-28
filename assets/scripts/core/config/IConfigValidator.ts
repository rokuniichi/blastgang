import { IConfig } from "./IConfig";

export interface IConfigValidator<TConfig extends IConfig> {
    validate(raw: any): TConfig;
}