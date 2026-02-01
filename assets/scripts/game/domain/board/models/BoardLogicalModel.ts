import { Matrix } from "../../../../core/collections/Matrix";
import { BoardKey } from "../../../application/board/BoardKey";
import { TileCommit } from "./TileCommit";
import { TileMove } from "./TileMove";
import { TilePosition } from "./TilePosition";
import { TileSpawn } from "./TileSpawn";
import { TileType } from "./TileType";

export class BoardLogicalModel {

    private readonly _board: Matrix<TileType>;
    private _commits: Map<string, TileCommit>;

    public constructor(width: number, height: number) {
        this._board = new Matrix<TileType>(width, height, () => TileType.EMPTY);
        this._commits = new Map();
    }

    public get width(): number {
        return this._board.width;
    }

    public get height(): number {
        return this._board.height;
    }

    public flush(): TileCommit[] {
        const result = Array.from(this._commits.values());
        this._commits.clear();
        return result;
    }

    public get(position: TilePosition): TileType {
        return this._board.get(position.x, position.y);
    }

    public empty(position: TilePosition): boolean {
        return this._board.get(position.x, position.y) == TileType.EMPTY;
    }

    public spawn(spawn: TileSpawn) {
        this.setType(spawn.at, spawn.type);
    }

    public move(move: TileMove) {
        const type = this.get(move.from);
        this.setType(move.to, type);
        this.setType(move.from, TileType.EMPTY);
    }

    public destroy(position: TilePosition) {
        this.setType(position, TileType.EMPTY);
    }

    private setType(position: TilePosition, type: TileType) {
        const before = this.get(position);
        if (before === type) return;

        this.pushChange(position, before, type);
        this._board.set(position.x, position.y, type);
    }

    private pushChange(position: TilePosition, before: TileType, after: TileType) {
        const key = BoardKey.position(position);
        let change = this._commits.get(key);

        if (!change) {
            change = { position, before, after };
            this._commits.set(key, change);
        } else {
            change.after = after;
        }
    }
}

