import { TweenSettings } from "../../common/animations/TweenSettings";
import { PresentationView, PresentationViewContextFactory } from "../../common/view/PresentationView";
import { PresentationGraph } from "../../PresentationGraph";
import { ScreenFadeContext } from "../context/ScreenFadeContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class ScreenFade extends PresentationView<ScreenFadeContext> {
    @property
    private targetOpacity: number = 140;

    public contextFactory(): PresentationViewContextFactory<ScreenFadeContext> {
        return (presentation: PresentationGraph) => new ScreenFadeContext(presentation);
    }

    protected onInit(): void {
        this.node.active = false;
    }

    public fadeIn() {
        this.node.opacity = 0;
        this.node.active = true;
        this.context.tweenSystem.build(TweenSettings.fade(this.node, 0, 0.25, this.targetOpacity))
            .start();
    }

    public fadeOut() {
        this.context.tweenSystem.build(TweenSettings.fade(this.node, 0, 0.1, 0))
            .call(() => this.node.active = false)
            .start();
    }
}