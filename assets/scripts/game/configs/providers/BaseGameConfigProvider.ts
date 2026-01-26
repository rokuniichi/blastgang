import { IGameConfigProvider } from "../providers/IGameConfigProvider";
import { GameConfig } from "../GameConfig";

export abstract class BaseGameConfigProvider implements IGameConfigProvider {
    protected config: GameConfig;

    abstract load(): Promise<void>;

    getConfig(): GameConfig {
        return this.config;
    }
}