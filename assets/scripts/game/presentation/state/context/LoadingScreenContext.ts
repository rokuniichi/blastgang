import { TweenHelper } from "../../common/animations/TweenHelper";
import { EventViewContext } from "../../common/context/EventViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class LoadingScreenContext extends EventViewContext {
    readonly tweenHelper: TweenHelper;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.tweenHelper = presentation.tweenHelper;
    }
}