import { Matrix } from "../../../../core/collections/Matrix";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export enum TileLockReason {
    NONE = 0,
    DESTROY = 1 << 0,
    MOVE = 1 << 1,
    SPAWN = 1 << 2,
    SHAKE = 1 << 3
}

export class BoardRuntime {

    private readonly _locks: Matrix<number>;

    constructor(width: number, height: number) {
        this._locks = new Matrix<number>(width, height, () => TileLockReason.NONE);
    }

    public isLocked(pos: TilePosition): boolean {
        return this._locks.get(pos.x, pos.y) !== TileLockReason.NONE;
    }

    public lock(reason: TileLockReason, position: TilePosition): void {
        const value = this._locks.get(position.x, position.y);
        this._locks.set(position.x, position.y, value | reason);
    }

    public unlock(reason: TileLockReason, position: TilePosition): void {
        const value = this._locks.get(position.x, position.y);
        this._locks.set(position.x, position.y, value & ~reason);
    }

    public clear(position: TilePosition): void {
        this._locks.set(position.x, position.y, TileLockReason.NONE);
    }

    public flush(): TilePosition[] {
        const result: TilePosition[] = [];
        this._locks.forEach((_, x, y) => this.clear({ x, y }));
        return result;
    }
}
