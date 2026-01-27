import { TilePosition } from "./TilePosition";
import { TileType } from "./TileType";

export class BoardModel {

    private readonly tiles: TileType[][];

    public readonly width: number;
    public readonly height: number;

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.tiles = new Array<TileType[]>(height);

        for (let y: number = 0; y < height; y++) {
            const row: TileType[] = new Array<TileType>(width);
            for (let x: number = 0; x < width; x++) {
                row[x] = TileType.NONE;
            }
            this.tiles[y] = row;
        }
    }

    public get(pos: TilePosition): TileType {
        return this.tiles[pos.y][pos.x];
    }

    public set(pos: TilePosition, type: TileType): void {
        this.tiles[pos.y][pos.x] = type;
    }

    public forEach(cb: (type: TileType, pos: TilePosition) => void): void {
        for (let y: number = 0; y < this.height; y++) {
            for (let x: number = 0; x < this.width; x++) {
                cb(this.tiles[y][x], { x, y });
            }
        }
    }
}