import { clamp } from "../../../core/utils/maths";
import { SlingFxInfo } from "../../config/visual/VisualConfig";

const { ccclass } = cc._decorator;

enum SlingPhase {
    IDLE,
    PULL,
    LAUNCH,
    SETTLE,
    DONE
}

@ccclass
export class SlingMotion extends cc.Component {

    private _phase: SlingPhase = SlingPhase.IDLE;

    private _from!: cc.Vec2;
    private _to!: cc.Vec2;
    private _pull!: cc.Vec2;
    private _overshoot!: cc.Vec2;

    private _pullDuration = 0;
    private _launchDuration = 0;
    private _settleDuration = 0;

    private _pullDistance = 0;
    private _overshootDistance = 0;

    private _phaseTime = 0;
    private _running = false;

    private _baseScale = 1;

    private _onSlinged: (() => void) | null = null;

    // ======================
    // easing
    // ======================

    private smooth(t: number) {
        return t * t * (3 - 2 * t);
    }

    private cubicOut(t: number) {
        return 1 - Math.pow(1 - t, 3);
    }

    private cubicInOut(t: number) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    public play(
        from: cc.Vec2,
        to: cc.Vec2,
        slingInfo: SlingFxInfo
    ) {

        this._from = from.clone();
        this._to = to.clone();

        this._pullDistance = slingInfo.pullDistance;
        this._overshootDistance = slingInfo.overshootDistance;

        this._pullDuration = slingInfo.pullDuration;
        const distance = from.sub(to).mag();
        this._launchDuration = clamp(distance / slingInfo.launchSpeed, slingInfo.minLaunchDuration, slingInfo.maxLaunchDuration);
        this._settleDuration = slingInfo.settleDuration;

        this._baseScale = this.node.scale;

        const dir = to.sub(from).normalize();

        this._pull = from.sub(dir.mul(slingInfo.pullDistance));
        this._overshoot = to.add(dir.mul(slingInfo.overshootDistance));

        this.node.setPosition(from);

        this._phase = SlingPhase.PULL;
        this._phaseTime = 0;
        this._running = true;
    }

    public get running() { return this._running; }

    public onSlinged(callback: () => void) {
        this._onSlinged = callback;
    }

    update(dt: number) {

        if (!this._running) return;

        this._phaseTime += dt;

        switch (this._phase) {

            case SlingPhase.PULL: {

                const t = Math.min(this._phaseTime / this._pullDuration, 1);
                const e = this.smooth(t);

                const pos = this._from.lerp(this._pull, e);
                this.node.setPosition(pos);


                if (t >= 1) {
                    this._phase = SlingPhase.LAUNCH;
                    this._phaseTime = 0;
                }

                break;
            }

            case SlingPhase.LAUNCH: {

                const t = Math.min(this._phaseTime / this._launchDuration, 1);
                const e = this.cubicInOut(t);

                const position = this._pull.lerp(this._overshoot, e);
                this.node.setPosition(position);

                if (t >= 1) {
                    this._phase = SlingPhase.SETTLE;
                    this._phaseTime = 0;
                }

                break;
            }

            case SlingPhase.SETTLE: {

                const t = Math.min(this._phaseTime / this._settleDuration, 1);
                const e = this.cubicOut(t);

                const pos = this._overshoot.lerp(this._to, e);
                this.node.setPosition(pos);

                const restore = 1 - e;

                this.node.scaleX =
                    this._baseScale +
                    (this.node.scaleX - this._baseScale) * restore;

                this.node.scaleY =
                    this._baseScale +
                    (this.node.scaleY - this._baseScale) * restore;

                if (t >= 1) {

                    this.node.setPosition(this._to);
                    this.node.scale = this._baseScale;

                    this._phase = SlingPhase.DONE;
                    this._running = false;

                    this._onSlinged?.();
                    this._onSlinged = null;
                }

                break;
            }
        }
    }
}
