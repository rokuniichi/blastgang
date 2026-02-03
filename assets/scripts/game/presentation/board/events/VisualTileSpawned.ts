import { IEvent } from "../../../../core/events/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export class VisualTileSpawned implements IEvent {
    public constructor(public readonly id: TileId) { }
}