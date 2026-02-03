import { BoardRuntimeModel } from "../../../application/board/runtime/BoardRuntimeModel";
import { VisualConfig } from "../../../application/common/config/visual/VisualConfig";
import { TileSpawned } from "../../../domain/board/events/mutations/TileSpawned";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { EventViewContext } from "../../common/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly visualConfig: VisualConfig;
    readonly animationSystem: TweenHelper;
    readonly runtimeModel: BoardRuntimeModel;
    readonly boardWidth: number;
    readonly boardHeight: number;
    readonly initialBoard: TileSpawned[];
}