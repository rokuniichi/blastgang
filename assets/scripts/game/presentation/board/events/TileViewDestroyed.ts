import { IEvent } from "../../../../core/events/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class VisualTileDestroyed implements IEvent {
    public constructor(public readonly id: TileId) { }
}