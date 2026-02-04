import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TileVisualAgent } from "./TileVisualAgent";

export class BoardVisualModel {
    private readonly _map: Map<TileId, TileVisualAgent>;

    public constructor() {
        this._map = new Map<TileId, TileVisualAgent>();
    }

    register(agent: TileVisualAgent) {
        this._map.set(agent.id, agent);
    }

    get(id: TileId): TileVisualAgent | undefined {
        return this._map.get(id);
    }

    remove(id: TileId) {
        this._map.delete(id);
    }
}
