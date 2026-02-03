import { ShakeSettings } from "../settings/ShakeSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class ShakeTween implements ITween<ShakeSettings> {
    
    public readonly type = TweenType.SHAKE;

    build(settings: ShakeSettings): cc.Tween {
        const startAngle = settings.node.angle;
        return cc.tween(settings.node)
            .to(settings.duration, { angle: startAngle + settings.amplitude })
            .to(settings.duration * 2, { angle: startAngle - settings.amplitude })
            .to(settings.duration * 2, { angle: startAngle + settings.amplitude })
            .to(settings.duration, { angle: startAngle })
    }
}
