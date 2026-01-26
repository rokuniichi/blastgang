import { TileModel } from "./TileModel";
import { TileType } from "./TileType";

export class BoardModel {
    private readonly _width: number;
    private readonly _height: number;
    private _tiles: TileModel[][];

    public constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.initBoard();
    }

    public get width(): TileType { return this._width; }
    public get height(): number {return this._height;}

    public getTile(x: number, y: number): TileModel | null {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return null;
        }
        return this._tiles[y][x];
    }

    public setTile(x: number, y: number, type: TileType): void {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.type = type;
        }
    }

    public forEach(callback: (tile: TileModel) => void): void {
        for (const row of this._tiles) {
            for (const tile of row) {
                callback(tile);
            }
        }
    }

    private initBoard() {
        this._tiles = [];
        for (let y = 0; y < this._height; y++) {
            const row: TileModel[] = [];
            for (let x = 0; x < this._width; x++) {
                row.push(new TileModel(x, y, TileType.NONE));
            }
            this._tiles.push(row);
        }
    }
}