import { IGameConfigProvider } from "../providers/IGameConfigProvider";
import { GameConfig } from "../GameConfig";

export abstract class BaseGameConfigProvider implements IGameConfigProvider {
    protected config!: GameConfig;

    abstract load(): Promise<void>;

    getConfig(): GameConfig {
        if (!this.config) {
            throw new Error(`[${this.constructor.name}] Config not loaded`);
        }
        return this.config;
    }
}