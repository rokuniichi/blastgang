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

    private _pullDuration = 0;
    private _launchDuration = 0;

    private _disappearDistance = 0;

    private _phaseTime = 0;
    private _running = false;

    private _baseScale = 1;

    private _onSlinged: (() => void) | null = null;

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

        this._pullDuration = slingInfo.pullDuration;
        this._launchDuration = slingInfo.minLaunchDuration;

        this._disappearDistance = slingInfo.disappearDistance;


        const dir = to.sub(from).normalize();

        this._pull = from.sub(dir.mul(slingInfo.pullDistance));

        this.node.setPosition(from);

        this._phase = SlingPhase.PULL;
        this._phaseTime = 0;
        this._running = true;
    }

    public get running() { return this._running; }

    public onSlinged(callback: () => void) {
        this._onSlinged = callback;
    }

    protected update(dt: number) {

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

                const position = this._pull.lerp(this._to, e);
                this.node.setPosition(position);
                const distance = this.node.position.sub(cc.v3(this._to)).mag();
                if (t >= 1 || distance < this._disappearDistance) {
                    this._phase = SlingPhase.SETTLE;
                    this._phaseTime = 0;
                }

                break;
            }

            case SlingPhase.SETTLE: {

                this.node.setPosition(this._to);
                this.node.scale = this._baseScale;

                this._phase = SlingPhase.DONE;
                this._running = false;

                this._onSlinged?.();
                this._onSlinged = null;

                break;
            }
        }
    }
}
