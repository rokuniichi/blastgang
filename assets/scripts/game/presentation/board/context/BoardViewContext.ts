import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TileSpawned } from "../../../domain/board/events/mutations/TileSpawned";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { EventViewContext } from "../../common/context/EventViewContext";

export interface BoardViewContext extends EventViewContext {
    readonly visualConfig: VisualConfig;
    readonly tweenHelper: TweenHelper;
    readonly boardCols: number;
    readonly boardRows: number;
    readonly initialBoard: TileSpawned[];
}