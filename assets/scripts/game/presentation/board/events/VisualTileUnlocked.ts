import { IEvent } from "../../../../core/events/IEvent";
import { TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export class VisualTileUnlocked implements IEvent {
    public constructor(public readonly id: TileId, public readonly reason: TileLockReason) { }
}