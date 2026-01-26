import { GameConfigSource } from "./GameConfigSource";
import { GameConfig } from "./GameConfig";
import { IGameConfigProvider } from "./providers/IGameConfigProvider";
import { DefaultGameConfigProvider } from "./providers/DefaultGameConfigProvider";
import { JsonGameConfigProvider } from "./providers/JsonGameConfigProvider";
import { assertNotNull } from "../../core/utils/assert";

export class GameConfigLoader {
    async load(mode: GameConfigSource): Promise<GameConfig> {
        const provider = this.createProvider(mode);
        await provider.load();
        const config = provider.getConfig();
        return config;
    }

    private createProvider(mode: GameConfigSource): IGameConfigProvider {
        switch (mode) {
            case GameConfigSource.JSON:
                return new JsonGameConfigProvider("configs/game-config");
            case GameConfigSource.DEFAULT:
            default:
                return new DefaultGameConfigProvider();
        }
    }
}