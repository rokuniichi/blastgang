import { Random } from "../../../../../core/utils/random";
import { FlashSettings } from "../settings/FlashSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class FlashTween implements ITween<FlashSettings> {
    public readonly type = TweenType.FLASH;

    public build(settings: FlashSettings): cc.Tween {
        const startAngle = Random.floatRange(0, 360);
        settings.node.angle = startAngle;

        const driftAngle = Random.floatRange(-20, 20);

        return cc.tween(settings.node)
            .parallel(
                cc.tween()
                    .to(settings.durationIn, {
                        opacity: settings.peakOpacity,
                        scale: settings.node.scale * settings.scaleIn
                    })
                    .to(settings.durationOut, {
                        opacity: 0,
                        scale: settings.node.scale * settings.scaleOut
                    }),

                cc.tween().to(settings.durationIn + settings.durationOut, {
                    angle: startAngle + driftAngle
                })
            );
    }
}