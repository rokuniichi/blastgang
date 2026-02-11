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
    }

    public subtract(id: TileId): void {
        this._map.forEach((set, _) => {
            if (set.has(id)) {
                set.delete(id);
                return;
            }
        });
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