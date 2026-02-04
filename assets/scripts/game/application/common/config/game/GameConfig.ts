import { IConfig } from "../../../../../core/config/IConfig";
import { TileType } from "../../../../domain/board/models/TileType";

export interface GameConfig extends IConfig {
    readonly board: BoardInfo;
    readonly gameState: GameStateInfo;
}

export interface BoardInfo {
    readonly cols: number;
    readonly rows: number;
    readonly allowedTypes: TileType[];
    readonly clusterSize: number;
}

export interface GameStateInfo {
    readonly targetScore: number;
    readonly maxMoves: number;
    readonly scoreMultiplier: number;
    readonly boosters: BoostersInfo;
}

export interface BoostersInfo {
    readonly swap: number;
    readonly bomb: number;
}