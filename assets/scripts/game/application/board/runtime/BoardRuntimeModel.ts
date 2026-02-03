import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export enum TileRuntimeState {
    IDLE,
    DESTROYING,
    DROPPING,
    SPAWNING
}

export class BoardRuntimeModel {

    private readonly _map: Map<TileId, TileRuntimeState>;

    public constructor() {
        this._map = new Map<TileId, TileRuntimeState>();
    }

    public stable(id: TileId): boolean {
        return this._map.get(id) === TileRuntimeState.IDLE;
    }

    public register(id: TileId, state: TileRuntimeState) {
        this._map.set(id, state);
    }

    public set(id: TileId, state: TileRuntimeState): void {
        const tile = this._map.get(id);
        if (tile) this._map.set(id, state);
    }

    public delete(id: TileId): void {
        this._map.delete(id);
    }
}
