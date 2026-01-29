import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";
import { GravityFallSettings } from "./settings/GravityFallSettings";

export class GravityFallAnimation implements IAnimation<GravityFallSettings> {

    public readonly type = AnimationType.GRAVITY_FALL;

    play(settings: GravityFallSettings): Promise<void> {
        const {
            node,
            duration,
            targetY,
            bounce,
            bounceDuration,
            settleDuration,
            easing
        } = settings;

        return new Promise(resolve => {
            if (!cc.isValid(node)) {
                resolve();
                return;
            }

            cc.tween(node)
                .to(duration, { y: targetY }, { easing })
                .to(bounceDuration, { y: targetY + bounce }, { easing: "quadOut" })
                .to(settleDuration, { y: targetY }, { easing: "quadIn" })
                .call(resolve)
                .start();
        });
    }
}