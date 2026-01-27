import { EventBus } from "../../../core/event-system/EventBus";
import { BoardModel } from "../../domain/models/BoardModel";
import { AnimationSystem } from "../animation-system/AnimationSystem";

export interface BoardViewContext {
    readonly eventBus: EventBus;
    readonly board: BoardModel;
    readonly animationSystem: AnimationSystem;
}