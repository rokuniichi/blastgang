import { GameConfig } from "./GameConfig";
import { GameConfigMode } from "./GameConfigMode";
import { DefaultGameConfigProvider } from "./providers/DefaultGameConfigProvider";
import { JsonGameConfigProvider } from "./providers/JsonGameConfigProvider";
import { IConfigProvider } from "../../../core/config/IConfigProvider";

export class GameConfigLoader {
    async load(mode: GameConfigMode): Promise<GameConfig> {
        const provider = this.createProvider(mode);
        await provider.load();
        return provider.get();
    }

    private createProvider(mode: GameConfigMode): IConfigProvider<GameConfig> {
        switch (mode) {
            case GameConfigMode.JSON:
                return new JsonGameConfigProvider("configs/game-config");
            case GameConfigMode.DEFAULT:
            default:
                return new DefaultGameConfigProvider();
        }
    }
}