import { TileType } from "../../domain/board/models/TileType";
import { IConfig } from "../../../core/config/IConfig";

export interface GameConfig extends IConfig {
    boardWidth: number;
    boardHeight: number;
    allowedTypes: TileType[];
    clusterSize: number;
    targetScore: number;
    maxMoves: number;
    scoreMultiplier: number;
}