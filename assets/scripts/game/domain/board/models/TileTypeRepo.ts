import { TileId } from "./BoardLogicModel";
import { TileType } from "./TileType";

export class TileTypeRepo {
    private readonly _repo = new Map<TileId, TileType>();

    public register(id: TileId, type: TileType): void {
        this._repo.set(id, type);
    }

    public get(id: TileId): TileType | null {
        const type = this._repo.get(id);
        if (!type) return null;
        return type;
    }

    public remove(id: TileId): void {
        this._repo.delete(id);
    }
}