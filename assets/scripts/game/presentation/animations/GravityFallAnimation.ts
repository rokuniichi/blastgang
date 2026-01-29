import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";
import { GravityFallSettings } from "./settings/GravityFallSettings";

export class GravityFallAnimation implements IAnimation<GravityFallSettings> {

    public readonly type = AnimationType.GRAVITY_FALL;

    play(settings: GravityFallSettings): Promise<void> {
        const {
            node,
            duration,
            startY,
            delta,
            bounce,
            easing
        } = settings;

        return new Promise(resolve => {
            if (!cc.isValid(node)) {
                resolve();
                return;
            }

            node.y = startY;

            cc.tween(node)
                .to(duration, { y: startY + delta }, { easing })
                .to(duration * 0.4, { y: startY + delta + bounce }, { easing: "quadOut" })
                .to(duration * 0.4, { y: startY + delta }, { easing: "quadIn" })
                .call(resolve)
                .start();
        });
    }
}