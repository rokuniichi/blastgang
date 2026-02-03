import { IConfig } from "../../../../core/config/IConfig";
import { IConfigProvider } from "../../../../core/config/IConfigProvider";
import { IConfigValidator } from "../../../../core/config/IConfigValidator";
import { JsonConfigProvider } from "../../../../core/config/providers/JsonConfigProvider";
import { GameSettings } from "../settings/GameSettings";
import { ConfigMode } from "./ConfigMode";
import { ConfigLoader } from "../../../../core/config/ConfigLoader";


export abstract class BaseConfigLoader<T extends IConfig> extends ConfigLoader<T> {

    protected createProvider(mode: ConfigMode, validator: IConfigValidator<T>): IConfigProvider<T> {
        switch (mode) {
            case ConfigMode.JSON:
                return new JsonConfigProvider<T>(GameSettings.GAME_CONFIG, validator);
            default:
                return this.getDefaultProvider();
        }
    }

    protected abstract getDefaultProvider(): IConfigProvider<T>;
}