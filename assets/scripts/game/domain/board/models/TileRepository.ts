import { TileId } from "./BoardLogicModel";
import { TileType } from "./TileType";

export class TileRepository {
    private readonly _tiles = new Map<string, TileType>();

    register(id: TileId, type: TileType) {
        this._tiles.set(id, type);
    }

    get(id: TileId): TileType | null {
        const type = this._tiles.get(id);
        if (!type) return null;
        return type;
    }

    remove(id: TileId) {
        this._tiles.delete(id);
    }
}