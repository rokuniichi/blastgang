import { TweenType } from "./tweens/TweenType";
import { FadeSettings } from "./settings/FadeSettings";
import { DropSettings } from "./settings/DropSettings";
import { ShakeSettings } from "./settings/ShakeSettings";
import { DestroySettings } from "./settings/DestructionSettings";
import { BurstSettings } from "./settings/BurstSettings";
import { FlashSettings } from "./settings/FlashSettings";


export class TweenSettings {

    static fade(
        node: cc.Node,
        delay: number,
        duration: number,
        opacity: number
    ): FadeSettings {
        return {
            type: TweenType.FADE,
            node,

            delay,
            duration,
            opacity
        };
    }

    static drop(
        node: cc.Node,
        fromY: number,
        toY: number,
        gravity: number,
        delay: number
    ): DropSettings {
        return {
            type: TweenType.DROP,
            node,

            fromY,
            toY,
            gravity,
            delay,

            easing: "quadIn",
            bounce: 10,
            bounceDuration: 0.08,
            settleDuration: 0.08,
        };
    }


    static destroy(node: cc.Node): DestroySettings {
        return {
            type: TweenType.DESTROY,
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

    static shake(node: cc.Node): ShakeSettings {
        return {
            type: TweenType.SHAKE,
            node,

            duration: 0.05,
            amplitude: 8
        }
    }

    static burst(
        node: cc.Node,
        duration: number,
    ): BurstSettings {

        return {
            type: TweenType.BURST,
            node,
            duration
        };
    }

    static flash(node: cc.Node): FlashSettings {
    return {
        type: TweenType.FLASH,
        node,
        durationIn: 0.11,
        scaleIn: 1.0,
        durationOut: 0.16,
        scaleOut: 1.5,
        peakOpacity: 160
    };
}
}