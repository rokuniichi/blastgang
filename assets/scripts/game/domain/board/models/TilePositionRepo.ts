import { TileId } from "./BoardLogicModel";
import { TilePosition } from "./TilePosition";

export class TilePositionRepo {
    private readonly _repo = new Map<TileId, TilePosition>();

    public move(id: TileId, position: TilePosition): void {
        this._repo.set(id, { x: position.x, y: position.y });
    }

    public get(id: TileId): TilePosition | null {
        const position = this._repo.get(id);
        if (!position) return null;
        return { x: position.x, y: position.y };
    }

    public remove(id: TileId): void {
        this._repo.delete(id);
    }
}