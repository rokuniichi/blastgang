import { TileType } from "./TileType";
import { TilePosition } from "./TilePosition";

export class TileCluster {
    constructor(
        public readonly tiles: readonly TilePosition[],
        public readonly type: TileType
    ) {}

    get size(): number {
        return this.tiles.length;
    }
}