import { TileModel } from "./TileModel";
import { TileType } from "./TileType";

export class TileFactory {
    private _nextId = 0;

    create(type: TileType): TileModel {
        return {
            id: `tile_${this._nextId++}`,
            type
        };
    }
}