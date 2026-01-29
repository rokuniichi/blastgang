import { IConfigProvider } from "../../../../core/config/IConfigProvider";
import { JsonConfigProvider } from "../../../../core/config/providers/JsonConfigProvider";
import { GameSettings } from "../../GameSettings";
import { GameConfig } from "./GameConfig";
import { GameConfigMode } from "./GameConfigMode";
import { GameConfigValidator } from "./GameConfigValidator";
import { DefaultGameConfigProvider } from "./providers/DefaultGameConfigProvider";

export class GameConfigLoader {
    async load(mode: GameConfigMode): Promise<GameConfig> {
        const provider = this.createProvider(mode);
        await provider.load();
        return provider.get();
    }

    private createProvider(mode: GameConfigMode): IConfigProvider<GameConfig> {
        switch (mode) {
            case GameConfigMode.JSON:
                const path = GameSettings.configJsonPath;
                const validator = new GameConfigValidator();
                return new JsonConfigProvider<GameConfig>(path, validator);
            case GameConfigMode.DEFAULT:
            default:
                return new DefaultGameConfigProvider();
        }
    }
}