export class Matrix<T> {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _data: T[][];

    public constructor(width: number, height: number, factory: (x: number, y: number) => T) {
        this._width = width;
        this._height = height;
        this._data = new Array(height);

        for (let y = 0; y < height; y++) {
            this._data[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                this._data[y][x] = factory(x, y);
            }
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

    public forEach(cb: (value: T, x: number, y: number) => void): void {
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                cb(this._data[y][x], x, y);
            }
        }
    }
}