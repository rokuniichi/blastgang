import { AnimationType } from "./AnimationType";
import { DestructionSettings } from "./settings/DestructionSettings";
import { FadeSettings } from "./settings/FadeSettings";
import { GravityFallSettings } from "./settings/GravityFallSettings";


export class AnimationSettings {

    static fadeOverlay(node: cc.Node): FadeSettings {
        return {
            type: AnimationType.FADE,
            node,

            duration: 0.25,
            targetOpacity: 140
        };
    }

    static tileFall(node: cc.Node, startY: number, delta: number): GravityFallSettings {
        return {
            type: AnimationType.GRAVITY_FALL,
            node,

            delay: 0.05,
            duration: 0.3,
            startY,
            delta,
            bounce: 15,
            bounceDuration: 0.12,
            settleDuration: 0.12,
            easing: "quadIn"
        };
    }

    static tileDestroy(node: cc.Node): DestructionSettings {
        return {
            type: AnimationType.DESTRUCTION,
            node,

            squashDuration: 0.05,
            squashScale: 0.95,
            popDuration: 0.03,
            popScale: 1.2,
            shrinkDuration: 0.3,
            shrinkOpacity: 0,
            shrinkScale: 0.2
        };
    }
}