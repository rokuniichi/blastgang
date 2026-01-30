import { BoardRuntime } from "../../../application/board/runtime/BoardRuntime";
import { TileChange } from "../../../domain/board/models/TileChange";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { EventViewContext } from "../../common/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly animationSystem: AnimationSystem;
    readonly boardRuntime: BoardRuntime;
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly initialBoard: TileChange[];
}