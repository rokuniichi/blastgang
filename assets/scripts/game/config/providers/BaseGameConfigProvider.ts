import { IGameConfigProvider } from "../providers/IGameConfigProvider";
import { GameConfig } from "../GameConfig";
import { assertNotNull } from "../../../core/utils/assert";

export abstract class BaseGameConfigProvider implements IGameConfigProvider {
    protected config: GameConfig | null = null;

    abstract load(): Promise<void>;

    getConfig(): GameConfig {
        assertNotNull(this.config, this, "config");
        return this.config;
    }
}