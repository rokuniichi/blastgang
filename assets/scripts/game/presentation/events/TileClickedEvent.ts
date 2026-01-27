import { IEvent } from "../../../core/event-system/IEvent";
import { TilePosition } from "../../domain/models/TilePosition";

export class TileClickedEvent implements IEvent {
    readonly type = "TileClickedEvent";

    constructor(public readonly position: TilePosition) {}
}