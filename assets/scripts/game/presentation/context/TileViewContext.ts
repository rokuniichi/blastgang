import { EventBus } from "../../../core/event-system/EventBus";
import { TilePosition } from "../../domain/board/models/TilePosition";

export interface TileViewContext {
    readonly eventBus: EventBus;
    readonly position: TilePosition;
}