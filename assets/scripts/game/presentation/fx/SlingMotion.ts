const { ccclass } = cc._decorator;

enum SlingPhase {
    Idle,
    PullBack,
    Launch,
    Settle,
    Done
}

@ccclass
export class SlingMotion extends cc.Component {

    private _phase = SlingPhase.Idle;
    private _running = false;
    private _phaseTime = 0;

    private _start!: cc.Vec2;
    private _pull!: cc.Vec2;
    private _target!: cc.Vec2;

    private _pullDuration = 0.08;
    private _launchDuration = 0.18;
    private _settleDuration = 0.05;

    private _onDone: (() => void) | null = null;

    private quadIn(t: number) { return t * t; }
    private quadOut(t: number) { return t * (2 - t); }

    public play(
        from: cc.Vec2,
        to: cc.Vec2,
        pullDistance: number
    ) {

        this._start = from.clone();
        this._target = to.clone();

        const dir = to.sub(from).normalize();
        this._pull = from.sub(dir.mul(pullDistance));

        this.node.setPosition(from);

        this._phase = SlingPhase.PullBack;
        this._phaseTime = 0;
        this._running = true;
    }

    public onDone(cb: () => void) {
        this._onDone = cb;
    }

    update(dt: number) {

        if (!this._running) return;

        this._phaseTime += dt;

        switch (this._phase) {

            case SlingPhase.PullBack: {

                const t = Math.min(this._phaseTime / this._pullDuration, 1);
                const e = this.quadOut(t);

                const pos = this._start.lerp(this._pull, e);
                this.node.setPosition(pos);

                if (t >= 1) {
                    this._phase = SlingPhase.Launch;
                    this._phaseTime = 0;
                }

                break;
            }

            case SlingPhase.Launch: {

                const t = Math.min(this._phaseTime / this._launchDuration, 1);
                const e = this.quadIn(t);

                const pos = this._pull.lerp(this._target, e);
                this.node.setPosition(pos);

                if (t >= 1) {
                    this._phase = SlingPhase.Settle;
                    this._phaseTime = 0;
                }

                break;
            }

            case SlingPhase.Settle: {

                const t = Math.min(this._phaseTime / this._settleDuration, 1);
                this.node.setPosition(this._target);

                if (t >= 1) {
                    this._phase = SlingPhase.Done;
                    this._running = false;
                    this._onDone?.();
                    this._onDone = null;
                }

                break;
            }
        }
    }

    public get running() { return this._running; }
}