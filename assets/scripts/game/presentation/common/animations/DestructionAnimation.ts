import { AnimationType } from "./AnimationType";
import { DestructionSettings } from "./settings/DestructionSettings";
import { IAnimation } from "./IAnimation";

export class DestructionAnimation implements IAnimation<DestructionSettings> {

    public readonly type = AnimationType.DESTROY;

    play(settings: DestructionSettings): Promise<void> {
        return new Promise(resolve => {
            if (!cc.isValid(settings.node)) {
                resolve();
                return;
            }

            const originalScale = settings.node.scale as number;
            const originalOpacity = settings.node.opacity;

            cc.tween(settings.node)
                .to(settings.squashDuration, { scale: originalScale * settings.squashScale }, { easing: "sineOut" })
                .to(settings.popDuration, { scale: originalScale * settings.popScale }, { easing: "quadOut" })
                .parallel(
                    cc.tween().to(settings.shrinkDuration, { opacity: settings.shrinkOpacity }),
                    cc.tween().to(settings.shrinkDuration, { scale: originalScale * settings.shrinkScale })
                )
                .call(() => {
                    settings.node.scale = originalScale;
                    settings.node.opacity = originalOpacity;
                    settings.node.active = false;
                    resolve();
                })
                .start();
        });
    }
}