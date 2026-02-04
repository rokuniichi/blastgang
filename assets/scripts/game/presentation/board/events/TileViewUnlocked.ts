import { IEvent } from "../../../../core/events/IEvent";
import { TileLock } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export class TileViewUnlocked implements IEvent {
    public constructor(public readonly id: TileId, public readonly reason: TileLock) { }
}