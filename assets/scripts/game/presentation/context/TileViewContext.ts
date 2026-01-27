import { EventBus } from "../../../core/event-system/EventBus";
import { TilePosition } from "../../domain/models/TilePosition";

export interface TileViewContext {
    readonly eventBus: EventBus;
    readonly position: TilePosition;
}