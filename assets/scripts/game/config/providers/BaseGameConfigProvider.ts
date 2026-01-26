import { GameConfig } from "../GameConfig";
import { IGameConfigProvider } from "./IGameConfigProvider";

export abstract class BaseGameConfigProvider implements IGameConfigProvider {
    protected config: GameConfig;

    abstract load(): Promise<void>;

    getConfig(): GameConfig {
        return this.config;
    }
}