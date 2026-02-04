import { TweenType } from "./TweenType";
import { FadeSettings } from "../settings/FadeSettings";
import { ITween } from "./ITween";

export class FadeTween implements ITween<FadeSettings> {
    public readonly type = TweenType.FADE;

    build(settings: FadeSettings): cc.Tween {
        return cc.tween(settings.node).delay(settings.delay).to(settings.duration, { opacity: settings.opacity }, { easing: "quadOut" });
    }
}