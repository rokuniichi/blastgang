import { IConfig } from "../../../../../core/config/IConfig";

export interface VisualConfig extends IConfig {
    readonly baseDropTime: number;
    readonly perTileTime: number;
}