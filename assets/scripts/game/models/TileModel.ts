import { TileType } from "./TileType";

export class TileModel {

    private readonly _x: number;
    private readonly _y: number;
    private _type: TileType;

    public constructor(x: number, y: number, type: TileType) {
        this._x = x;
        this._y = y;
        this._type = type;
    }

    public get type(): TileType { return this._type; }
    public get x(): number {return this._x;}
    public get y(): number {return this._y;}

    public set type(value: TileType) {
        this._type = value;
    }

    public equals(other: TileModel): boolean {
        return this.type == other.type;
    }

    public empty(): boolean {
        return this.type === TileType.NONE;
    }
}