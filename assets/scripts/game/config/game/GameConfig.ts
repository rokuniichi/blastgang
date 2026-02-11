import { IConfig } from "../../../core/config/IConfig";
import { TileType } from "../../domain/board/models/TileType";
import { BoosterType } from "../../domain/state/models/BoosterType";
import { ThresholdType } from "./ThresholdType";

export interface GameConfig extends IConfig {
    readonly board: BoardInfo;
    readonly gameState: GameStateInfo;
}

export interface BoardInfo {
    readonly cols: number;
    readonly rows: number;
    readonly allowedTypes: TileType[];
    readonly clusterSize: number;
    readonly bombRadius: number;
    readonly specials: ThresholdInfo[];
}

export interface ThresholdInfo {
    readonly type: ThresholdType;
    readonly amount: number;
}

export interface GameStateInfo {
    readonly targetScore: number;
    readonly maxMoves: number;
    readonly scoreMultiplier: number;
    readonly boosters: ReadonlyMap<BoosterType, number>;
}