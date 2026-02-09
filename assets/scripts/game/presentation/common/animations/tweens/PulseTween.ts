import { PulseSettings } from "../settings/PulseSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class PulseTween implements ITween<PulseSettings> {
    public readonly type = TweenType.PULSE;
    public build(settings: PulseSettings): cc.Tween {
        return cc.tween(settings.node)
            .to(settings.durationIn, {
                scale: settings.node.scale * settings.scaleIn
            })
            .to(settings.durationOut, {
                scale: settings.node.scale * settings.scaleOut
            })
    }
}