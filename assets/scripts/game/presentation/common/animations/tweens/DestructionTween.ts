import { DestructionSettings } from "../settings/DestructionSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class DestructionTween implements ITween<DestructionSettings> {

    public readonly type = TweenType.DESTROY;

    build(settings: DestructionSettings): cc.Tween {
        const node = settings.node;

        const originalScale = node.scale as number;
        const originalOpacity = node.opacity;

        return cc.tween(node)
            .to(settings.squashDuration, { scale: originalScale * settings.squashScale }, { easing: "sineOut" })
            .to(settings.popDuration, { scale: originalScale * settings.popScale }, { easing: "quadOut" })
            .parallel(
                cc.tween().to(settings.shrinkDuration, { opacity: settings.shrinkOpacity }),
                cc.tween().to(settings.shrinkDuration, { scale: originalScale * settings.shrinkScale })
            )
            .call(() => {
                node.scale = originalScale;
                node.opacity = originalOpacity;
                node.active = false;
            });
    }
}