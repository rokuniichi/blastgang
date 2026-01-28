import { EventBus } from "../../../../core/events/EventBus";
import { TilePosition } from "../../../domain/board/models/TilePosition";


export interface TileViewContext {
    readonly eventBus: EventBus;
    readonly position: TilePosition;
}