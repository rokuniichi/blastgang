import { TileId } from "./BoardLogicModel";

export class TileFactory {
    private _nextId = 0;

    create(): TileId {
        return `tile_${this._nextId++}`;
    }
}