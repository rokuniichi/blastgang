import { IEvent } from "../../../core/event-system/IEvent";
import { TilePosition } from "../../domain/models/TilePosition";

export class TilesUpdatedEvent implements IEvent {
    readonly type = "TilesUpdatedEvent";

    constructor(public readonly tiles: readonly TilePosition[]) {}
}