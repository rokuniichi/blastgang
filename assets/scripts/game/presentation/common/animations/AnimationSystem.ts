import { assertNotNull } from "../../../../core/utils/assert";
import { AnimationType } from "./AnimationType";
import { DestructionAnimation } from "./DestructionAnimation";
import { FadeAnimation } from "./FadeAnimation";
import { GravityFallAnimation } from "./GravityFallAnimation";
import { IAnimation } from "./IAnimation";
import { IAnimationSettings } from "./IAnimationSettings";
import { ShakeAnimation } from "./ShakeAnimation";


export class AnimationSystem {

    private animations = new Map<AnimationType, IAnimation<any>>();

    public constructor() {
        this.register();
    }

    private register(): void {
        this.add(new DestructionAnimation());
        this.add(new FadeAnimation());
        this.add(new GravityFallAnimation());
        this.add(new ShakeAnimation());
    }

    private add(animation: IAnimation<any>): void {
        this.animations.set(animation.type, animation);
    }

    public play(settings: IAnimationSettings): Promise<void> {
        const animation = this.animations.get(settings.type);
        assertNotNull(animation, this, "animation");
        return animation.play(settings);
    }
}