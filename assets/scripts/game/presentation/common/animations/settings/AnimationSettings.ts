import { AnimationType } from "../AnimationType";
import { DestructionSettings } from "./DestructionSettings";
import { FadeSettings } from "./FadeSettings";
import { GravityFallSettings } from "./GravityFallSettings";
import { ShakeSettings } from "./ShakeSettings";


export class AnimationSettings {

    static fadeOverlay(node: cc.Node): FadeSettings {
        return {
            type: AnimationType.FADE,
            node,

            duration: 0.25,
            targetOpacity: 140
        };
    }

    static tileFall(node: cc.Node, targetY: number): GravityFallSettings {
        return {
            type: AnimationType.DROP,
            node,

            duration: 1,
            targetY,
            bounce: 15,
            bounceDuration: 0.12,
            settleDuration: 0.12,
            easing: "quadIn"
        };
    }

    static tileDestroy(node: cc.Node): DestructionSettings {
        return {
            type: AnimationType.DESTROY,
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

    static tileShake(node: cc.Node): ShakeSettings {
        return {
            type: AnimationType.SHAKE,
            node,
            duration: 0.05,
            amplitude: 8
        }
    }
}