import { TileDrop } from "../models/TileDrop";
import { TilePosition } from "../models/TilePosition";

export class BoardProcessedEvent {
    public constructor(
        public readonly destroyed: TilePosition[],
        public readonly dropped: TileDrop[],
        public readonly spawned: TilePosition[]
    ) { }
}