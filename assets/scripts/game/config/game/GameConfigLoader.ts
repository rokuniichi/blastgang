import { IConfigProvider } from "../../../core/config/providers/IConfigProvider";
import { BaseConfigLoader } from "../BaseConfigLoader";
import { GameConfig } from "./GameConfig";
import { DefaultGameConfigProvider } from "./DefaultGameConfigProvider";
import { IConfigValidator } from "../../../core/config/IConfigValidator";
import { GameConfigValidator } from "./GameConfigValidator";
import { GameSettings } from "../../settings/GameSettings";

export class GameConfigLoader extends BaseConfigLoader<GameConfig> {
    protected getJsonPath(): string {
        return GameSettings.GAME_CONFIG;
    }
    protected createValidator(): IConfigValidator<GameConfig> {
        return new GameConfigValidator();
    }
    protected override getDefaultProvider(): IConfigProvider<GameConfig> {
        return new DefaultGameConfigProvider();
    }
}