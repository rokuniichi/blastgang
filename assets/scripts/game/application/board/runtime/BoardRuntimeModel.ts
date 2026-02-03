import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export enum TileLockReason {
    NONE = 0,
    DESTROY = 1 << 0,
    DROP = 1 << 1,
    SPAWN = 1 << 2,
    SHAKE = 1 << 3,
    SWAP = 1 << 4
}

export class BoardRuntimeModel {

    private readonly _locks: Map<TileId, TileLockReason>;

    public constructor() {
        this._locks = new Map<TileId, TileLockReason>();
    }

    public stable(id: TileId): boolean {
        return this._locks.get(id) === TileLockReason.NONE;
    }

    public lock(id: TileId, reason: TileLockReason): void {
        const value = this._locks.get(id);
        if (!value) {
            this.register(id, reason);
            return;
        }

        this._locks.set(id, value! | reason);
    }

    public unlock(id: TileId, reason: TileLockReason): void {
        const value = this._locks.get(id);
        if (!value) {
            this.register(id, TileLockReason.NONE);
            return;
        }

        this._locks.set(id, value! & ~reason);
    }

    private register(id: TileId, reason: TileLockReason): void {
        this._locks.set(id, reason);
    }

    public delete(id: TileId): void {
        this._locks.delete(id);
    }
}
