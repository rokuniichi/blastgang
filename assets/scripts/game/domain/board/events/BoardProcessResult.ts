import { TileChange } from "../models/TileChange";
import { TileMove } from "../models/TileMove";
import { TilePosition } from "../models/TilePosition";
import { TileSpawn } from "../models/TileSpawn";

export class BoardProcessResult {
    public constructor(
        public readonly destroyed: TilePosition[],
        public readonly dropped: TileMove[],
        public readonly spawned: TileSpawn[],
        public readonly changes: TileChange[]
    ) { }
}