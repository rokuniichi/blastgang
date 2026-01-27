import { GameConfig } from "./GameConfig";
import { GameConfigSource } from "./GameConfigSource";
import { DefaultGameConfigProvider } from "./providers/DefaultGameConfigProvider";
import { IGameConfigProvider } from "./providers/IGameConfigProvider";
import { JsonGameConfigProvider } from "./providers/JsonGameConfigProvider";

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