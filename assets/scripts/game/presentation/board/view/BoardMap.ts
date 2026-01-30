import { BoardKey } from "../../../application/board/BoardKey";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileView } from "./TileView";

export class BoardMap {
    private readonly _map: Map<string, TileView>;

    constructor() {
        this._map = new Map<string, TileView>();
    }

    public get(position: TilePosition): TileView | null {
        const result = this._map.get((BoardKey.position(position)));
        return result ?? null;
    }

    public set(position: TilePosition, tile: TileView): void {
        this._map.set(BoardKey.position(position), tile)
    }

    public delete(position: TilePosition): void {
        this._map.delete(BoardKey.position(position));
    }

    public views(): TileView[] {
        return Array.from(this._map.values());
    }
}