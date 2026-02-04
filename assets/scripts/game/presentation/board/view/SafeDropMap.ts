export class SafeDropMap {

    private readonly _map: Map<number, number>;

    public constructor() {
        this._map = new Map<number, number>();
    }

    public add(column: number): void {
        this._map.set(column, (this._map.get(column) ?? 0) + 1);
    }
    
    public subtract(column: number): void {
        const value = this._map.get(column);
        if (!value || value === 0) return;
        this._map.set(column, value - 1)
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