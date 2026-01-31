import { TileMove } from "./TileMove";
import { TilePosition } from "./TilePosition";
import { TileSpawn } from "./TileSpawn";

export interface VisualInstructions {
    readonly destroyed: TilePosition[],
    readonly dropped: TileMove[],
    readonly spawned: TileSpawn[]
}