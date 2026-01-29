export class Matrix<T> {

    private readonly _width: number;
    private readonly _height: number;
    private readonly _data: T[][];

    constructor(width: number, height: number, factory: (x: number, y: number) => T) {
        this._width = width;
        this._height = height;
        this._data = new Array<T[]>(height);

        for (let y: number = 0; y < height; y++) {
            const row: T[] = new Array<T>(width);
            for (let x: number = 0; x < width; x++) {
                row[x] = factory(x, y);
            }
            this._data[y] = row;
        }
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get(x: number, y: number): T {
        return this._data[y][x];
    }

    public set(x: number, y: number, value: T): void {
        this._data[y][x] = value;
    }

    public swap(x1: number, y1: number, x2: number, y2: number): void {
        const tmp = this._data[y1][x1];
        this._data[y1][x1] = this._data[y2][x2];
        this._data[y2][x2] = tmp;
    }

    public forEach(callback: (value: T, x: number, y: number) => void): void {
        for (let y: number = 0; y < this._height; y++) {
            for (let x: number = 0; x < this._width; x++) {
                callback(this._data[y][x], x, y);
            }
        }
    }
}