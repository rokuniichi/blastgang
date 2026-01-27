import { TileType } from "../domain/board/models/TileType";

export interface GameConfig {
    boardWidth: number;
    boardHeight: number;
    allowedTypes: TileType[];
    clusterSize: number;
    targetScore: number;
    maxMoves: number;
    scoreMultiplier: number;
}