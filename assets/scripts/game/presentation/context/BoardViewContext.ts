import { EventBus } from "../../../core/event-system/EventBus";
import { BoardModel } from "../../domain/board/models/BoardModel";
import { AnimationSystem } from "../animations/AnimationSystem";

export interface BoardViewContext {
    readonly eventBus: EventBus;
    readonly boardModel: BoardModel;
    readonly animationSystem: AnimationSystem;
}