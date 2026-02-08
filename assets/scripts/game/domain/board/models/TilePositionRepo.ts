import { TileId } from "./BoardLogicModel";
import { TilePosition } from "./TilePosition";

export class TilePositionRepo {
    private readonly _repo = new Map<string, TilePosition>();

    public register(id: TileId, position: TilePosition): void {
        this._repo.set(id, position);
    }

    public get(id: TileId): TilePosition | null {
        const position = this._repo.get(id);
        if (!position) return null;
        return position;
    }

    public remove(id: TileId): void {
        this._repo.delete(id);
    }
}