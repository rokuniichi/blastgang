import { TweenHelper } from "../../common/animations/TweenHelper";
import { TweenSettings } from "../../common/animations/TweenSettings";

export class TileFlashFx {

    constructor(
        private readonly _tweenHelper: TweenHelper,
        private readonly _fxLayer: cc.Node,
        private readonly _prefab: cc.Prefab
    ) {}

    public play(local: cc.Vec3): void {

        const flash = cc.instantiate(this._prefab);

        flash.setParent(this._fxLayer);
        flash.setPosition(local);

        flash.opacity = 0;

        this._tweenHelper.build(
            TweenSettings.flash(flash)
        ).start();
    }
}