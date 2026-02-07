import { StateUpdate } from "../../../domain/state/events/StateUpdate";
import { GameStateType } from "../../../domain/state/models/GameStateType";
import { GameRestartRequset } from "../../board/events/GameRestartRequest";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { EventView } from "../../common/view/EventView";
import { PresentationViewContextConstructor } from "../../common/view/PresentationView";
import { GameOverPopupContext } from "../context/GameOverPopupContext";
import { ScreenFade } from "./ScreenFade";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameOverPopup extends EventView<GameOverPopupContext> implements IPopup {
    @property(ScreenFade)
    private screenFade: ScreenFade = null!

    @property(cc.Node)
    private wonRoot: cc.Node = null!;

    @property(cc.Node)
    private lostRoot: cc.Node = null!;

    private _state: GameStateType = GameStateType.NONE;

    public contextConstructor(): PresentationViewContextConstructor<GameOverPopupContext> {
        return GameOverPopupContext;
    }

    protected onInit(): void {
        this.node.active = false;
        this.on(StateUpdate, this.onStateUpdate);
    }

    public request() {
        this.screenFade.fadeOut();
        this.emit(new GameRestartRequset());
    }

    show(): void {
        if (this._state !== GameStateType.WON && this._state !== GameStateType.LOST)
            return;
        this.node.active = true;
        this.wonRoot.active = this._state === GameStateType.WON;
        this.lostRoot.active = this._state === GameStateType.LOST;
        this.startAnimation();
    }

    hide(): void {
        this.node.active = false;
    }

    private onStateUpdate = (event: StateUpdate): void => {
        this._state = event.value;
        this.show();
    };

    private startAnimation() {
        this.screenFade.fadeIn();
        this.context.tweenSystem.build(TweenSettings.fade(this.node, 0, 0.25, 255)).start();
    }
}