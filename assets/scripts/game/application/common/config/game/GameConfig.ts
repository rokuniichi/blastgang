import { IConfig } from "../../../../../core/config/IConfig";
import { TileType } from "../../../../domain/board/models/TileType";

export interface GameConfig extends IConfig {
    readonly boardCols: number;
    readonly boardRows: number;
    readonly allowedTypes: TileType[];
    readonly clusterSize: number;
    readonly targetScore: number;
    readonly maxMoves: number;
    readonly scoreMultiplier: number;
}