import { DropSettings } from "../settings/DropSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class DropTween implements ITween<DropSettings> {

    public readonly type = TweenType.DROP;

    build(settings: DropSettings): cc.Tween {
        const distance = Math.abs(settings.toY - settings.fromY);
        const duration = distance / settings.speed;

        return cc.tween(settings.node)
            .set({ y: settings.fromY })
            .to(duration, { y: settings.toY }, { easing: "quadIn" })
            .to(settings.bounceDuration, { y: settings.toY + settings.bounce }, { easing: "quadOut" })
            .to(settings.settleDuration, { y: settings.toY }, { easing: "quadIn" });
    }
}