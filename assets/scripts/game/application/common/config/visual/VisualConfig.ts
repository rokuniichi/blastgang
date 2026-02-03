import { IConfig } from "../../../../../core/config/IConfig";

export interface VisualConfig extends IConfig {
    readonly cellsPerSecond: number;
    readonly spawnLineY: number;
}