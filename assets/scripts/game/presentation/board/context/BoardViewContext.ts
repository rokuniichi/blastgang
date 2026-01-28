import { BoardModel } from "../../../domain/board/models/BoardModel";
import { AnimationSystem } from "../../animations/AnimationSystem";
import { EventViewContext } from "../../core/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly boardModel: BoardModel;
    readonly animationSystem: AnimationSystem;
}