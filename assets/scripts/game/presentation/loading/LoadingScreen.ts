import { LoadingScreenFaded } from "../board/events/LoadingScreenFaded";
import { PresentationReady } from "../board/events/PresentationReady";
import { TweenSettings } from "../common/animations/TweenSettings";
import { EventView } from "../common/view/EventView";
import { LoadingScreenContext } from "./LoadingScreenContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingScreen extends EventView<LoadingScreenContext> {

    @property(cc.Node)
    private screen: cc.Node = null!;

    @property
    private delay: number = 5;

    @property
    private duration: number = 0.2;

    protected onInit(): void {
        this.on(PresentationReady, this.onPresentationReady);
    }

    private onPresentationReady = () => {
        this.context.tweenHelper.build(TweenSettings.fade(this.screen, this.delay, this.duration, 0))
            .call(() => this.emit(new LoadingScreenFaded()))
            .start();
    };
}