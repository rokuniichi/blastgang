// presentation/events/TilesUpdatedEvent.ts
import { IEvent } from "../../../core/event-system/IEvent";
import { TileModel } from "../../domain/models/TileModel";

export class TilesUpdatedEvent implements IEvent {
    readonly type = "TilesUpdatedEvent";

    constructor(public readonly tiles: readonly TileModel[]) {}
}