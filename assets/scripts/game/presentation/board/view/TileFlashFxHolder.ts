import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { NodePool } from "../../common/view/NodePool";

export class TileFlashFxHolder implements IDisposable {
    private readonly _tweenSystem: TweenSystem;
    private readonly _prefab: cc.Prefab;

    private readonly _flashPool: NodePool;

    constructor(tweenSystem: TweenSystem, prefab: cc.Prefab, parent: cc.Node, size: number) {
        this._tweenSystem = tweenSystem;
        this._prefab = prefab;

        this._flashPool = new NodePool(this._prefab, parent, size);
    }

    public dispose(): void {
        console.log(`[DISPOSE] flash pool:`);
        this._flashPool.dispose();
    }

    public play(local: cc.Vec3): void {

        const flash = this._flashPool.pull();
        flash.active = true;
        flash.setPosition(local);
        flash.scale = 1;
        flash.opacity = 0;

        this._tweenSystem.build(TweenSettings.flash(flash))
            .call(() => this._flashPool.release(flash))
            .start();
    }
}