import { assertNotNull } from "../../../../core/utils/assert";
import { TweenType } from "./tweens/TweenType";
import { DestructionTween } from "./tweens/DestructionTween";
import { ITween } from "./tweens/ITween";
import { ITweenSettings } from "./settings/ITweenSettings";
import { ShakeTween } from "./tweens/ShakeTween";

export class TweenHelper {

    private readonly tweens = new Map<TweenType, ITween<any>>();

    public constructor() {
        this.register();
    }

    private register(): void {
        this.add(new DestructionTween());
        //this.add(new FadeTween());
        //this.add(new GravityFallTween());
        this.add(new ShakeTween());
    }

    private add(tween: ITween<any>): void {
        this.tweens.set(tween.type, tween);
    }

    public build<T extends ITweenSettings>(settings: T): cc.Tween {
        const tween = this.tweens.get(settings.type);
        assertNotNull(tween, this, "tween");
        return tween.build(settings);
    }
}