import { GameLoaded } from "../../board/events/GameLoaded";
import { GameRestartRequset } from "../../board/events/GameRestartRequest";
import { PresentationReady } from "../../board/events/PresentationReady";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { EventPresentationView } from "../../common/view/EventView";
import { PresentationViewContextConstructor } from "../../common/view/PresentationView";
import { LoadingScreenContext } from "../context/LoadingScreenContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingScreen extends EventPresentationView<LoadingScreenContext> {
    @property(cc.Node)
    private screen: cc.Node = null!;

    @property
    private screenDelay: number = 5;

    @property
    private screenFadeOutDuration: number = 0.2;

    @property([cc.Node])
    private dots: cc.Node[] = [];

    @property
    dotsFadeInDuration: number = 0.5;

    @property
    dotsBetweenDelay: number = 0.15;

    @property
    dotsFadeOutDuration: number = 0.3;

    @property
    dotPauseBetweenLoops: number = 0.2;

    private _tween?: cc.Tween | null;

    public contextConstructor(): PresentationViewContextConstructor<LoadingScreenContext> {
        return LoadingScreenContext;
    }

    protected onInit(): void {
        this.resetDots();
        this.startAnimation();
        this.on(PresentationReady, this.onPresentationReady);
        this.on(GameRestartRequset, this.onGameRestart);
    }

    private onPresentationReady = () => {
        this.fadeScreen();
    };

    private onGameRestart() {

    };

    private resetDots() {
        for (const dot of this.dots) {
            dot.opacity = 0;
        }
    }

    private startAnimation() {
        this._tween = cc.tween();

        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            this._tween.delay(this.dotsBetweenDelay);
            this._tween.call(() => this.fadeDot(dot));
        }
        this._tween.delay(this.dotPauseBetweenLoops);

        this._tween = cc.tween(this.screen)
            .repeatForever(this._tween)
            .start();
    }

    private fadeDot(dot: cc.Node) {
        cc.tween(dot)
            .set({ opacity: 0 })
            .to(this.dotsFadeInDuration, { opacity: 255 })
            .to(this.dotsFadeOutDuration, { opacity: 0 })
            .start();
    }

    private fadeScreen() {
        this.context.tweenHelper.build(TweenSettings.fade(this.screen, this.screenDelay, this.screenFadeOutDuration, 0))
            .call(() => {
                cc.Tween.stopAllByTarget(this.screen);
                this._tween = null;
                this.emit(new GameLoaded());
            })
            .start();
    }
}