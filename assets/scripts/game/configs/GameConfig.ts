import { TileType } from "../models/TileType";

export interface GameConfig {
    boardWidth: number;
    boardHeight: number;

    allowedTileTypes: TileType[];

    minClusterSize: number;

    targetScore: number;
    maxMoves: number;
}