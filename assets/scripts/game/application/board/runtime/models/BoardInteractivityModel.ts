import { TileId } from "../../../../domain/board/models/BoardLogicModel";

export class BoardInteractivityModel {

    private readonly _blockers: Set<TileId>;
    private readonly _unstables: Set<TileId>;

    public constructor() {
        this._blockers = new Set<TileId>();
        this._unstables = new Set<TileId>();
    }

    public lockedBoard(): boolean {
        return this._blockers.size !== 0;
    }

    public lockedTile(id: TileId): boolean {
        return this._unstables.has(id);
    }

    public addBlocker(id: TileId): void {
        this._blockers.add(id);
    }

    public addUnstable(id: TileId): void {
        this._unstables.add(id);
    }

    public removeUnstable(id: TileId): void {
        this.deleteUnstable(id);
        this.deleteBlocker(id);
    }

    public allUnstable(): Set<TileId> {
        return new Set<TileId>(this._unstables);
    }

    private deleteBlocker(id: TileId): void {
        this._blockers.delete(id);
    }

    private deleteUnstable(id: TileId): void {
        this._unstables.delete(id);
    }

    public clear(): void {
        this._blockers.clear();
        this._unstables.clear();
    }
}
