import { assertNotNull } from "../../../../core/utils/assert";
import { TweenType } from "./tweens/TweenType";
import { DestroyTween } from "./tweens/DestroyTween";
import { ITween } from "./tweens/ITween";
import { ITweenSettings } from "./settings/ITweenSettings";
import { ShakeTween } from "./tweens/ShakeTween";
import { DropTween } from "./tweens/DropTween";
import { FadeTween } from "./tweens/FadeTween";
import { BurstTween } from "./tweens/BurstTween";
import { FlashTween } from "./tweens/FlashTween";

export class TweenHelper {

    private readonly tweens = new Map<TweenType, ITween<any>>();

    public constructor() {
        this.register();
    }

    private register(): void {
        this.add(new DestroyTween());
        this.add(new FadeTween());
        this.add(new DropTween());
        this.add(new ShakeTween());
        this.add(new BurstTween());
        this.add(new FlashTween());
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