import { IConfigProvider } from "../../../../../core/config/IConfigProvider";
import { IConfigValidator } from "../../../../../core/config/IConfigValidator";
import { GameSettings } from "../../settings/GameSettings";
import { BaseConfigLoader } from "../BaseConfigLoader";
import { DefaultVisualConfigProvider } from "./DefaultVisualConfigProvider";
import { VisualConfig } from "./VisualConfig";
import { VisualConfigValidator } from "./VisualConfigValidator";

export class VisualConfigLoader extends BaseConfigLoader<VisualConfig> {
    protected getJsonPath(): string {
        return GameSettings.VISUAL_CONFIG;
    }
    protected createValidator(): IConfigValidator<VisualConfig> {
        return new VisualConfigValidator();
    }
    protected override getDefaultProvider(): IConfigProvider<VisualConfig> {
        return new DefaultVisualConfigProvider();
    }
}