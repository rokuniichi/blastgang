import { RuntimeBoardModel } from "../../../application/board/runtime/RuntimeBoardModel";
import { TileChange } from "../../../domain/board/models/TileChange";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { EventViewContext } from "../../common/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly animationSystem: AnimationSystem;
    readonly boardRuntime: RuntimeBoardModel;
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly initialBoard: TileChange[];
}