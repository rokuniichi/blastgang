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

    static popupFall(node: cc.Node): GravityFallSettings {
        return {
            type: AnimationType.GRAVITY_FALL,
            node,

            duration: 0.45,
            startOffsetY: 600,
            bounce: 0.15,
            easing: "quadOut"
        };
    }

    static tileFall(node: cc.Node): GravityFallSettings {
        return {
            type: AnimationType.GRAVITY_FALL,
            node,

            duration: 0.25,
            startOffsetY: 200,
            bounce: 0.05,
            easing: "quadOut"
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