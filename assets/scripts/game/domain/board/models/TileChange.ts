import { TileChangeType } from "./TileChangeType";
import { TilePosition } from "./TilePosition";
import { TileState } from "./TileState";
import { TileType } from "./TileType";

export interface TileChange {
    changeType: TileChangeType;
    position: TilePosition;
    typeBefore: TileType;
    typeAfter: TileType;
    stateBefore: TileState;
    stateAfter: TileState;
}