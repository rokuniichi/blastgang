import { ConfigLoader } from "../../../../core/config/ConfigLoader";
import { IConfig } from "../../../../core/config/IConfig";
import { IConfigProvider } from "../../../../core/config/IConfigProvider";
import { IConfigValidator } from "../../../../core/config/IConfigValidator";
import { JsonConfigProvider } from "../../../../core/config/providers/JsonConfigProvider";
import { ConfigMode } from "./ConfigMode";


export abstract class BaseConfigLoader<T extends IConfig> extends ConfigLoader<T> {

    protected createProvider(mode: ConfigMode, validator: IConfigValidator<T>): IConfigProvider<T> {
        switch (mode) {
            case ConfigMode.JSON:
                return new JsonConfigProvider<T>(this.getJsonPath(), validator);
            default:
                return this.getDefaultProvider();
        }
    }

    protected abstract getDefaultProvider(): IConfigProvider<T>;
    protected abstract getJsonPath(): string;
}