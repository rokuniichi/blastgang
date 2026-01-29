import { AnimationType } from "./AnimationType";
import { DestructionSettings } from "./settings/DestructionSettings";
import { IAnimation } from "./IAnimation";


export class DestructionAnimation implements IAnimation<DestructionSettings> {

    public readonly type = AnimationType.DESTRUCTION;

    play(settings: DestructionSettings): Promise<void> {
        const {
            node,
            squashDuration,
            squashScale,
            popDuration,
            popScale,
            shrinkDuration,
            shrinkOpacity,
            shrinkScale
        } = settings;

        return new Promise(resolve => {
            if (!cc.isValid(node)) {
                resolve();
                return;
            }

            const originalScale = node.scale;
            const originalOpacity = node.opacity;

            cc.tween(node)
                .to(squashDuration, { scale: originalScale * squashScale }, { easing: "sineOut" })
                .to(popDuration, { scale: originalScale * popScale }, { easing: "quadOut" })
                .parallel(
                    cc.tween().to(shrinkDuration, { opacity: shrinkOpacity }),
                    cc.tween().to(shrinkDuration, { scale: originalScale * shrinkScale })
                )
                .call(() => {
                    node.scale = originalScale;
                    node.opacity = originalOpacity;
                    node.active = false;
                    resolve();
                })
                .start();
        });
    }
}