import { Matrix } from "../../../core/collections/Matrix";
import { TileType } from "./TileType";

export class BoardModel {

    private readonly _matrix: Matrix<TileType>;

    public constructor(width: number, height: number) {
        this._matrix = new Matrix<TileType>(width, height, () => TileType.NONE);
    }

    public get width(): number {
        return this._matrix.width;
    }

    public get height(): number {
        return this._matrix.height;
    }

    public get(x: number, y: number): TileType {
        return this._matrix.get(x, y);
    }

    public set(x: number, y: number, type: TileType): void {
        this._matrix.set(x, y, type);
    }

    public swap(x1: number, y1: number, x2: number, y2: number): void {
        this._matrix.swap(x1, y1, x2, y2);
    }

    public isEmpty(x: number, y: number): boolean {
        return this.get(x, y) === TileType.NONE;
    }

    public forEach(cb: (type: TileType, x: number, y: number) => void): void {
        this._matrix.forEach(cb);
    }

    public fillWithType(type: TileType): void {
        this.forEach((_, x, y) => this.set(x, y, type));
    }

    public fillWithGenerator(generator: () => TileType) {
        this.forEach((_, x, y) => this.set(x, y, generator()));
    }

    public clear(x: number, y: number): void {
        this.set(x, y, TileType.NONE);
    }
}