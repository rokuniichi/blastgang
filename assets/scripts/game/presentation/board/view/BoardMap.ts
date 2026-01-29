import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileView } from "./TileView";

export class BoardMap {
    private readonly _boardWidth: number;
    private readonly _boardHeight: number;
    private readonly _map: Map<number, TileView>;

    constructor(width: number, height: number) {
        this._boardWidth = width;
        this._boardHeight = height;
        this._map = new Map<number, TileView>();
    }

    public get(position: TilePosition): TileView | null {
        const result = this._map.get(this.key(position));
        return result ?? null;
    }

    public set(position: TilePosition, tile: TileView): void {
        this._map.set(this.key(position), tile)
    }

    public delete(position: TilePosition): void {
        this._map.delete(this.key(position));
    }

    private key(position: TilePosition) {
        return TilePosition.key(position, this._boardWidth);
    }
}