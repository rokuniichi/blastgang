import { Matrix } from "../../../../core/collections/Matrix";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export enum TileLockReason {
    NONE = 0,
    DESTROY = 1 << 0,
    DROP = 1 << 1,
    SPAWN = 1 << 2,
    SWAP = 1 << 3,
}

export class BoardRuntime {

    private readonly locks: Matrix<number>;

    constructor(width: number, height: number) {
        this.locks = new Matrix<number>(width, height, () => TileLockReason.NONE);
    }

    public isLocked(pos: TilePosition): boolean {
        return this.locks.get(pos.x, pos.y) !== TileLockReason.NONE;
    }

    public lock(position: TilePosition, reason: TileLockReason): void {
        const value = this.locks.get(position.x, position.y);
        this.locks.set(position.x, position.y, value | reason);
    }

    public unlock(position: TilePosition, reason: TileLockReason): void {
        const value = this.locks.get(position.x, position.y);
        this.locks.set(position.x, position.y, value & ~reason);
    }

    public clear(position: TilePosition): void {
        this.locks.set(position.x, position.y, TileLockReason.NONE);
    }

    public snapshot(): TilePosition[] {
        const result: TilePosition[] = [];

        for (let x = 0; x < this.locks.width; x++) {
            for (let y = 0; y < this.locks.height; y++) {
                if (this.locks.get(x, y) !== TileLockReason.NONE) {
                    result.push({ x, y });
                }
            }
        }

        return result;
    }
}
