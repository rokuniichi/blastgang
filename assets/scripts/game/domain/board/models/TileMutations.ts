import { TileDestroy } from "./TileDestroy";
import { TileMove } from "./TileMove";
import { TileSpawn } from "./TileSpawn";

export interface TileMutations {
    readonly destroyed: TileDestroy[],
    readonly dropped: TileMove[],
    readonly spawned: TileSpawn[]
}