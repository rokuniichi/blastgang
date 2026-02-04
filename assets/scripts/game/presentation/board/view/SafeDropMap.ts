import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class SafeDropMap {

    private readonly _map: Map<number, Set<TileId>>;

    public constructor() {
        this._map = new Map<number, Set<TileId>>();
    }

    public add(column: number, id: TileId): void {
        const tiles = this._map.get(column) ?? new Set<TileId>();
        tiles.add(id);
        this._map.set(column, tiles);
        console.log(`[DROP MAP] ADD at x:${column}, now ${tiles.size}`)
    }

    public subtract(column: number, id: TileId): void {
        const tiles = this._map.get(column);
        if (!tiles) return;
        tiles.delete(id);
        console.log(`[DROP MAP] SUBSTRACT at x:${column}, now ${tiles.size}`)
    }

    public get(column: number): number {
        const tiles = this._map.get(column);
        if (!tiles) return 0;
        return tiles.size;
    }

    public reset() {
        this._map.clear();
    }

    public forEach(callback: (collection: Set<TileId>, key: number) => void): void {
        this._map.forEach((collection, number, _) => callback(collection, number));
    }
}