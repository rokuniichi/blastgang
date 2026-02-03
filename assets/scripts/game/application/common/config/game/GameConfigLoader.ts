import { IConfigProvider } from "../../../../../core/config/IConfigProvider";
import { BaseConfigLoader } from "../BaseConfigLoader";
import { GameConfig } from "./GameConfig";
import { DefaultGameConfigProvider } from "./DefaultGameConfigProvider";
import { IConfigValidator } from "../../../../../core/config/IConfigValidator";
import { GameConfigValidator } from "./GameConfigValidator";

export class GameConfigLoader extends BaseConfigLoader<GameConfig> {
    protected createValidator(): IConfigValidator<GameConfig> {
        return new GameConfigValidator();
    }
    protected override getDefaultProvider(): IConfigProvider<GameConfig> {
        return new DefaultGameConfigProvider();
    }
}