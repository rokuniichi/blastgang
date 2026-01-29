import { TileChange } from "../models/TileChange";
import { TileDrop } from "../models/TileDrop";
import { TilePosition } from "../models/TilePosition";

export class BoardChangedEvent {
    public constructor(
        public readonly destroyed: TilePosition[],
        public readonly dropped: TileDrop[],
        public readonly changes: TileChange[]
    ) { }
}