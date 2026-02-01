import { BoardRuntimeModel } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileCommit } from "../../../domain/board/models/TileCommit";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { EventViewContext } from "../../common/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly animationSystem: AnimationSystem;
    readonly runtimeModel: BoardRuntimeModel;
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly initialBoard: TileCommit[];
}