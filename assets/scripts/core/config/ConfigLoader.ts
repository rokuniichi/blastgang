import { IConfig } from "./IConfig";
import { IConfigProvider } from "./IConfigProvider";
import { IConfigValidator } from "./IConfigValidator";
import { ConfigMode } from "../../game/application/common/config/ConfigMode";

export abstract class ConfigLoader<T extends IConfig> {
    public async load(mode: ConfigMode): Promise<T> {
        const validator = this.createValidator();
        const provider = this.createProvider(mode, validator);
        await provider.load();
        return provider.get();
    }

    protected abstract createProvider(mode: ConfigMode, validator: IConfigValidator<T>): IConfigProvider<T>;
    protected abstract createValidator(): IConfigValidator<T>;
}