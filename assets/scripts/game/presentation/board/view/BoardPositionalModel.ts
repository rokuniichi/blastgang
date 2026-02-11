import { BoardKey } from "../../../application/board/BoardKey";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileVisualAgent } from "./TileVisualAgent";

export class BoardPositionalModel {
    private readonly _map: Map<string, TileVisualAgent>;

    public constructor() {
        this._map = new Map<string, TileVisualAgent>();
    }

    register(position: TilePosition, agent: TileVisualAgent) {
        this._map.set(BoardKey.position(position), agent);
    }

    get(position: TilePosition): TileVisualAgent | undefined {
        return this._map.get(BoardKey.position(position));
    }

    remove(position: TilePosition) {
        this._map.delete(BoardKey.position(position));
    }
}
