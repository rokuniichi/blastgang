import { TileChangeReason } from "./TileChangeReason";
import { TilePosition } from "./TilePosition";
import { TileState } from "./TileState";
import { TileType } from "./TileType";

export interface TileChange {
    changeType: TileChangeReason;
    position: TilePosition;
    typeBefore: TileType;
    typeAfter: TileType;
    stateBefore: TileState;
    stateAfter: TileState;
}