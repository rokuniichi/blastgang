import { EventBus } from "../../../core/eventbus/EventBus";
import { ShardFaded } from "../board/events/ShardFaded";

const { ccclass } = cc._decorator;

@ccclass
export class BurstMotion extends cc.Component {

    private _eventBus: EventBus | null = null;
    private _vx = 0;
    private _vy = 0;
    private _gravity = 0;
    private _drag = 1;
    private _av = 0;
    private _duration = 0.5;
    private _fadeDelay = 0.7;
    private _shrinkScale = 0.2;
    private _elapsed = 0;
    private _initialScale = 1;
    private _fadeStartTime = 0;
    private _running = false;

    public play(
        eventBus: EventBus,
        vx: number,
        vy: number,
        gravity: number,
        drag: number,
        av: number,
        duration: number,
        fadeDelay: number,
        shrinkScale: number
    ): void {
        this._eventBus = eventBus;
        this._elapsed = 0;
        this._running = true;
        this._initialScale = this.node.scale;
        this._vx = vx;
        this._vy = vy;
        this._gravity = gravity;
        this._drag = drag;
        this._av = av;
        this._duration = duration;
        this._fadeDelay = fadeDelay;
        this._shrinkScale = shrinkScale;

        this._fadeStartTime = this._duration * this._fadeDelay;
        this.node.opacity = 255;
    }

    protected update(dt: number): void {

        if (!this._running) return;

        this._elapsed += dt;

        if (this._elapsed >= this._duration) {
            this._eventBus?.emit(new ShardFaded(this.node));
            this._running = false;
            return;
        }

        this._vy -= this._gravity * dt;

        const dragFactor = Math.pow(this._drag, dt * 60);

        this._vx *= dragFactor;
        this._vy *= dragFactor;

        this.node.x += this._vx * dt;
        this.node.y += this._vy * dt;
        this.node.angle += this._av * dt;

        if (this._elapsed >= this._fadeStartTime) {

            const t =
                (this._elapsed - this._fadeStartTime) /
                (this._duration - this._fadeStartTime);

            this.node.opacity = 255 * (1 - t);

            this.node.scale = cc.misc.lerp(
                this._initialScale,
                this._shrinkScale,
                t
            );
        }
    }
}
