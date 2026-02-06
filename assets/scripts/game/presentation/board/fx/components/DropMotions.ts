const { ccclass } = cc._decorator;

enum DropPhase {
    Idle,
    Delay,
    Drop,
    BounceUp,
    Settle,
    Done
}

@ccclass
export class DropMotion extends cc.Component {

    private _phase: DropPhase = DropPhase.Idle;

    private _fromY = 0;
    private _toY = 0;

    private _delay = 0;

    private _bounce = 0;
    private _bounceDuration = 0;
    private _settleDuration = 0;

    private _gravity = 0;

    private _dropDuration = 0;

    private _elapsed = 0;
    private _running = false;

    private _phaseTime = 0;

    private _onDropped: (() => void) | null = null;

    // easing helpers
    private quadIn(t: number) {
        return t * t;
    }

    private quadOut(t: number) {
        return t * (2 - t);
    }

    public play(
        fromY: number,
        toY: number,
        gravity: number,
        delay: number,
        bounce: number,
        bounceDuration: number,
        settleDuration: number
    ) {

        this._gravity = gravity;

        this._fromY = fromY;
        this._toY = toY;

        const distance = Math.abs(toY - fromY);
        this._dropDuration = Math.sqrt((2 * distance) / gravity);

        this._delay = delay;
        this._bounce = bounce;
        this._bounceDuration = bounceDuration;
        this._settleDuration = settleDuration;

        this.node.y = fromY;

        this._elapsed = 0;
        this._phaseTime = 0;
        this._running = true;
        this._phase = delay > 0 ? DropPhase.Delay : DropPhase.Drop;
    }

    public get running() { return this._running };

    public onDropped(callback: () => void) {
        this._onDropped = callback;
    }

    update(dt: number) {

        if (!this._running) return;

        this._elapsed += dt;
        this._phaseTime += dt;

        switch (this._phase) {

            case DropPhase.Delay: {

                if (this._phaseTime >= this._delay) {
                    this._phase = DropPhase.Drop;
                    this._phaseTime = 0;
                }

                break;
            }

            case DropPhase.Drop: {

                const t = Math.min(this._phaseTime / this._dropDuration, 1);
                const eased = this.quadIn(t);

                this.node.y = this._fromY + (this._toY - this._fromY) * eased;

                if (t >= 1) {
                    this._phase = DropPhase.BounceUp;
                    this._phaseTime = 0;
                }

                break;
            }

            case DropPhase.BounceUp: {

                const t = Math.min(this._phaseTime / this._bounceDuration, 1);
                const eased = this.quadOut(t);

                this.node.y =
                    this._toY +
                    this._bounce * eased;

                if (t >= 1) {
                    this._phase = DropPhase.Settle;
                    this._phaseTime = 0;
                }

                break;
            }

            case DropPhase.Settle: {

                const t = Math.min(this._phaseTime / this._settleDuration, 1);
                const eased = this.quadIn(t);

                this.node.y =
                    this._toY +
                    this._bounce * (1 - eased);

                if (t >= 1) {
                    this.node.y = this._toY;
                    this._phase = DropPhase.Done;
                    this._running = false;
                    this._onDropped?.();
                    this._onDropped = null;
                }

                break;
            }
        }
    }
}