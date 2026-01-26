import { GameConfig } from "../GameConfig";

export interface IGameConfigProvider {
    load(): Promise<void>;
    getConfig(): GameConfig;
}