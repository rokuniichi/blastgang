import { ConfigMode } from "../../game/config/ConfigMode";
import { IConfig } from "./IConfig";
import { IConfigProvider } from "./providers/IConfigProvider";
import { IConfigValidator } from "./IConfigValidator";

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