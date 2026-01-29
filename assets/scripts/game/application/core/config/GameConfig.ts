import { IConfig } from "../../../../core/config/IConfig";
import { TileType } from "../../../domain/board/models/TileType";

export interface GameConfig extends IConfig {
    boardWidth: number;
    boardHeight: number;
    allowedTypes: TileType[];
    clusterSize: number;
    targetScore: number;
    maxMoves: number;
    scoreMultiplier: number;
}