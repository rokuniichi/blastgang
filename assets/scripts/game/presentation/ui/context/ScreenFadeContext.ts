import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { PresentationViewContext } from "../../common/view/PresentationViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class ScreenFadeContext extends PresentationViewContext {
    readonly tweenSystem: TweenSystem;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.tweenSystem = presentation.tweenSystem;
    }
}