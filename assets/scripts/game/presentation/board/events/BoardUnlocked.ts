import { IEvent } from "../../../../core/events/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";

export class BoardUnlocked implements IEvent {
    public constructor(public readonly id: TileId) { }
}