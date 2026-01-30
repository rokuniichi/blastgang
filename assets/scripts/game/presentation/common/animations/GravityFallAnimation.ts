import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";
import { GravityFallSettings } from "./settings/GravityFallSettings";

export class GravityFallAnimation implements IAnimation<GravityFallSettings> {

    public readonly type = AnimationType.GRAVITY_FALL;

    play(settings: GravityFallSettings): Promise<void> {
        return new Promise(resolve => {
            if (!cc.isValid(settings.node)) {
                resolve();
                return;
            }

            cc.tween(settings.node)
                .to(settings.duration, { y: settings.targetY }, { easing: settings.easing })
                .to(settings.bounceDuration, { y: settings.targetY + settings.bounce }, { easing: "quadOut" })
                .to(settings.settleDuration, { y: settings.targetY }, { easing: "quadIn" })
                .call(resolve)
                .start();
        });
    }
}