import { BoardRuntimeModel } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileSpawned } from "../../../domain/board/events/mutations/TileSpawned";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { EventViewContext } from "../../common/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly animationSystem: TweenHelper;
    readonly runtimeModel: BoardRuntimeModel;
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly initialBoard: TileSpawned[];
}