import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { NodePool } from "../../common/view/NodePool";

export class TileFlashFx {
    private readonly _tweenSystem: TweenSystem;
    private readonly _parent: cc.Node;
    private readonly _prefab: cc.Prefab;

    private readonly _flashPool: NodePool;

    constructor(tweenSystem: TweenSystem, prefab: cc.Prefab, parent: cc.Node, size: number) {
        this._tweenSystem = tweenSystem;
        this._prefab = prefab;
        this._parent = parent;

        this._flashPool = new NodePool(this._prefab, this._parent, size);
    }

    public play(local: cc.Vec3): void {

        const flash = this._flashPool.pull();

        flash.active = true;
        flash.setParent(this._parent);
        flash.setPosition(local);

        flash.opacity = 0;

        this._tweenSystem.play(TweenSettings.flash(flash))
            .call(() => this._flashPool.release(flash));
    }
}