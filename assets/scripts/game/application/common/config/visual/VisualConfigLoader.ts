import { IConfigProvider } from "../../../../../core/config/IConfigProvider";
import { IConfigValidator } from "../../../../../core/config/IConfigValidator";
import { BaseConfigLoader } from "../BaseConfigLoader";
import { DefaultVisualConfigProvider } from "./DefaultVisualConfigProvider";
import { VisualConfig } from "./VisualConfig";
import { VisualConfigValidator } from "./VisualConfigValidator";

export class VisualConfigLoader extends BaseConfigLoader<VisualConfig> {
    protected createValidator(): IConfigValidator<VisualConfig> {
        throw new VisualConfigValidator();
    }
    protected override getDefaultProvider(): IConfigProvider<VisualConfig> {
        return new DefaultVisualConfigProvider();
    }
}