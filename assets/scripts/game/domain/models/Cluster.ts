import { TilePosition } from "../models/TilePosition";

export class Cluster {

    public readonly tiles: readonly TilePosition[];

    public constructor(tiles: readonly TilePosition[]) {
        this.tiles = tiles;
    }

    public get size(): number {
        return this.tiles.length;
    }
}