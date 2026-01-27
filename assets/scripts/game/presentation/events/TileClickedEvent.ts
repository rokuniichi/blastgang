import { IEvent } from "../../../core/event-system/IEvent";
import { TilePosition } from "../../domain/board/models/TilePosition";

export class TileClickedEvent implements IEvent {
    public constructor(public readonly position: TilePosition) { }
}