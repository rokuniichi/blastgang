import { TileChange } from "../models/TileChange";
import { TileMove } from "../models/TileMove";
import { TilePosition } from "../models/TilePosition";

export class BoardChangedEvent {
    public constructor(
        public readonly destroyed: TilePosition[],
        public readonly dropped: TileMove[],
        public readonly changes: TileChange[]
    ) { }
}