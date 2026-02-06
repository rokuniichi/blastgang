import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { EventViewContext } from "../../common/context/EventViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class BoardViewContext extends EventViewContext {
    readonly visualConfig: VisualConfig;
    readonly tweenHelper: TweenHelper;
    readonly boardCols: number;
    readonly boardRows: number;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.visualConfig = presentation.visualConfig;
        this.tweenHelper = presentation.tweenHelper;
        this.boardCols = presentation.boardCols;
        this.boardRows = presentation.boardRows;
    }
}