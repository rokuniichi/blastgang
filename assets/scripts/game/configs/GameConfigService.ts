import { GameConfigMode } from "./GameConfigMode";
import { GameConfig } from "./GameConfig";
import { IGameConfigProvider } from "./providers/IGameConfigProvider";
import { DefaultGameConfigProvider } from "./providers/DefaultGameConfigProvider";
import { JsonGameConfigProvider } from "./providers/JsonGameConfigProvider";

export class GameConfigService {
    async load(mode: GameConfigMode): Promise<GameConfig> {
        const provider = this.createProvider(mode);
        await provider.load();
        return provider.getConfig();
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