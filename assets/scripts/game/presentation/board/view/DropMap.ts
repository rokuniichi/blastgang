export class DropMap {
    private readonly _map = new Map<number, number>();

    public add(column: number) {
        this._map.set(column, (this._map.get(column) ?? 0) + 1);
    }

    public get(column: number): number {
        return this._map.get(column) ?? 0;
    }

    public reset() {
        this._map.clear();
    }

    public forEach(callback: (value: number, key: number) => void): void {
        this._map.forEach((value, number, _) => callback(value, number));
    }
}