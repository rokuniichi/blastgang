import { GameConfigMode } from "./GameConfigMode";
import { GameConfig } from "./GameConfig";
import { IGameConfigProvider } from "./providers/IGameConfigProvider";
import { DefaultGameConfigProvider } from "./providers/DefaultGameConfigProvider";
import { JsonGameConfigProvider } from "./providers/JsonGameConfigProvider";
import { assertNotNull } from "../../core/utils/assert";

export class GameConfigService {
    async load(mode: GameConfigMode): Promise<GameConfig> {
        const provider = this.createProvider(mode);
        await provider.load();

        const config = provider.getConfig();
        assertNotNull(config, this, "GameConfig");

        return config;
    }

    private createProvider(mode: GameConfigMode): IGameConfigProvider {
        switch (mode) {
            case GameConfigMode.JSON:
                return new JsonGameConfigProvider("configs/game-config");
            case GameConfigMode.DEFAULT:
            default:
                return new DefaultGameConfigProvider();
        }
    }
}