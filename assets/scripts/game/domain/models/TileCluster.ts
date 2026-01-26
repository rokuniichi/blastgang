import { TileModel } from "./TileModel";
import { TileType } from "./TileType";

export class TileCluster {

    private readonly _tiles: TileModel[];
    private readonly _type: TileType;

    public constructor(tiles: TileModel[], type: TileType) {
        this._tiles = tiles;
        this._type = type;
    }

    public get tiles(): readonly TileModel[] {
        return this._tiles;
    }

    public get type(): TileType {
        return this._type;
    }

    public get size(): number {
        return this._tiles.length;
    }
}