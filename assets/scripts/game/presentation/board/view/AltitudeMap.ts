import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class AltitudeMap {

    private readonly _map: Map<number, TileId | null>;

    public constructor() {
        this._map = new Map<number, TileId>();
    }

    public add(column: number, id: TileId) {
        this._map.set(column, id);
    }

    public remove(column: number) {
        this._map.set(column, null);
    }

    public get(column: number): TileId | null {
        return this._map.get(column) ?? null;
    }

    public reset() {
        this._map.clear();
    }

    public forEach(callback: (value: TileId | null, key: number) => void): void {
        this._map.forEach((value, number, _) => callback(value, number));
    }
}