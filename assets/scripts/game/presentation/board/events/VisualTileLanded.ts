import { IEvent } from "../../../../core/eventbus/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export class VisualTileLanded implements IEvent {
    public constructor(public readonly id: TileId, public readonly position: TilePosition) { }
}