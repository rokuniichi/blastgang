import { Matrix } from "../../../core/collections/Matrix";
import { TilePosition } from "./TilePosition";
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

    public get(position: TilePosition): TileType {
        return this._matrix.get(position.x, position.y);
    }

    public set(position: TilePosition, type: TileType): void {
        this._matrix.set(position.x, position.y, type);
    }

    public swap(first: TilePosition, second: TilePosition): void {
        this._matrix.swap(first.x, first.y, second.x, second.y);
    }

    public isEmpty(position: TilePosition): boolean {
        return this.get(position) === TileType.NONE;
    }

    public forEach(cb: (type: TileType, position: TilePosition) => void): void {
        this._matrix.forEach((type, x, y) => { cb(type, { x, y }) });
    }

    public fillWithType(type: TileType): void {
        this.forEach((_, p) => this.set(p, type));
    }

    public fillWithGenerator(generator: () => TileType) {
        this.forEach((_, p) => this.set(p, generator()));
    }

    public clear(position: TilePosition): void {
        this.set(position, TileType.NONE);
    }
}