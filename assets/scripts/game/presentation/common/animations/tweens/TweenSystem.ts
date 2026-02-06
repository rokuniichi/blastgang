import { ITweenSettings } from "../settings/ITweenSettings";
import { TweenHelper } from "../TweenHelper";

export class TweenSystem {

    private readonly _helper: TweenHelper;
    private readonly _active = new Set<cc.Tween>();

    public constructor() {
        this._helper = new TweenHelper();
    }

    public build<T extends ITweenSettings>(settings: T): cc.Tween {
        const tween = this._helper.build(settings);
        this.track(tween);
        return tween;
    }

    public play<T extends ITweenSettings>(settings: T): cc.Tween {
        const tween = this.build(settings);
        this.track(tween);
        tween.start();
        return tween;
    }

    public dispose(): void {
        this.killAll();
    }

    private track(tween: cc.Tween): void {
        this._active.add(tween);
    }

    private killAll(): void {
        this._active.forEach((t) => t.stop());
        this._active.clear();
    }
}