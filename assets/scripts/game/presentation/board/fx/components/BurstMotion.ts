const { ccclass } = cc._decorator;

@ccclass
export class BurstMotion extends cc.Component {

    public vx = 0;
    public vy = 0;

    public gravity = 0;
    public drag = 1;
    public av = 0;

    public duration = 0.5;
    public fadeDelay = 0.7;
    public shrinkScale = 0.2;

    private _elapsed = 0;
    private _initialScale = 1;
    private _fadeStartTime = 0;
    private _running = false;

    public play(): void {
        this._elapsed = 0;
        this._running = true;
        this._initialScale = this.node.scale;

        this._fadeStartTime = this.duration * this.fadeDelay;

        this.node.opacity = 255;
    }

    update(dt: number): void {

        if (!this._running) return;

        this._elapsed += dt;

        if (this._elapsed >= this.duration) {
            this.node.destroy();
            return;
        }

        this.vy -= this.gravity * dt;

        const dragFactor = Math.pow(this.drag, dt * 60);

        this.vx *= dragFactor;
        this.vy *= dragFactor;

        this.node.x += this.vx * dt;
        this.node.y += this.vy * dt;
        this.node.angle += this.av * dt;

        if (this._elapsed >= this._fadeStartTime) {

            const t =
                (this._elapsed - this._fadeStartTime) /
                (this.duration - this._fadeStartTime);

            this.node.opacity = 255 * (1 - t);

            this.node.scale = cc.misc.lerp(
                this._initialScale,
                this.shrinkScale,
                t
            );
        }
    }
}
