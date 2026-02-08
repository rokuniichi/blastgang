import { Matrix } from "../../../../core/collections/Matrix";
import { TilePosition } from "./TilePosition";


export type TileId = string;

export class BoardLogicModel {
    public readonly width: number;
    public readonly height: number;

    // game map
    private readonly _grid: Matrix<TileId | null>;

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this._grid = new Matrix(this.width, this.height, () => null);
    }

    public register(at: TilePosition, id: string) {
        this._grid.set(at.x, at.y, id);
    }

    public move(from: TilePosition, to: TilePosition) {
        const id = this._grid.get(from.x, from.y);
        if (!id) return;

        this._grid.set(from.x, from.y, null);
        this._grid.set(to.x, to.y, id);
    }

    public destroy(at: TilePosition) {
        const id = this._grid.get(at.x, at.y);
        if (!id) return;

        this._grid.set(at.x, at.y, null);
    }

    public get(at: TilePosition): TileId | null {
        return this._grid.get(at.x, at.y);
    }

    public empty(at: TilePosition): boolean {
        return this._grid.get(at.x, at.y) === null;
    }
}