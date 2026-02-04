import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export enum TileLock {
    NONE = 0,
    DESTROY = 1 << 0,
    DROP = 1 << 1,
    SPAWN = 1 << 2,
    SHAKE = 1 << 3,
    SWAP = 1 << 4
}

export class BoardRuntimeModel {

    private readonly _tileLocks: Map<TileId, TileLock>;
    private _boardLocks: number;

    public constructor() {
        this._tileLocks = new Map<TileId, TileLock>();
        this._boardLocks = 0;
    }

    public stableTile(id: TileId): boolean {
        return this._tileLocks.get(id) === TileLock.NONE;
    }

    public lockTile(id: TileId, reason: TileLock): void {
        const value = this._tileLocks.get(id);
        if (!value) {
            this.registerTile(id, reason);
            return;
        }

        this._tileLocks.set(id, value! | reason);
    }

    public unlockTile(id: TileId, reason: TileLock): void {
        const value = this._tileLocks.get(id);
        if (!value) {
            this.registerTile(id, TileLock.NONE);
            return;
        }

        this._tileLocks.set(id, value! & ~reason);
    }

    private registerTile(id: TileId, reason: TileLock): void {
        this._tileLocks.set(id, reason);
    }

    public deleteTile(id: TileId): void {
        this._tileLocks.delete(id);
    }

    public stableBoard(): boolean {
        return this._boardLocks === 0;
    }

    public lockBoard(): void {
        this._boardLocks++;
        console.log(`[LOCKS] incremented ${this._boardLocks}`);
    }

    public unlockBoard(): void {
        this._boardLocks = Math.max(0, this._boardLocks - 1);
        console.log(`[LOCKS] decremented ${this._boardLocks}`);
    }
}
