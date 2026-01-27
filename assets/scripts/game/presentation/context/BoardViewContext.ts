import { EventBus } from "../../../core/event-system/EventBus";
import { BoardModel } from "../../domain/models/BoardModel";

export interface BoardViewContext {
    readonly eventBus: EventBus;
    readonly board: BoardModel;
}