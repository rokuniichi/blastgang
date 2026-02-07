import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { EventViewContext } from "../../common/context/EventViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class LoadingScreenContext extends EventViewContext {
    readonly tweenSystem: TweenSystem;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.tweenSystem = presentation.tweenSystem;
    }
}