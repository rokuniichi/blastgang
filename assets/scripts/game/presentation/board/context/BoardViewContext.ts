import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { EventViewContext } from "../../common/context/EventViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class BoardViewContext extends EventViewContext {
    readonly visualConfig: VisualConfig;
    readonly tweenSystem: TweenSystem;
    readonly boardCols: number;
    readonly boardRows: number;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.visualConfig = presentation.visualConfig;
        this.tweenSystem = presentation.tweenSystem;
        this.boardCols = presentation.boardCols;
        this.boardRows = presentation.boardRows;
    }
}