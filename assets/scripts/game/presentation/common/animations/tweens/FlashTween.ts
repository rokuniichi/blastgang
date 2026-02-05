import { FlashSettings } from "../settings/FlashSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class FlashTween implements ITween<FlashSettings> {
    public readonly type = TweenType.FLASH;

    public build(settings: FlashSettings): cc.Tween {

        return cc.tween(settings.node)
            .to(settings.durationIn, {
                opacity: settings.peakOpacity,
                scale: settings.node.scale * settings.scaleIn
            })
            .to(settings.durationOut, {
                opacity: 0,
                scale: settings.node.scale * settings.scaleOut
            })
            .call(() => settings.node.destroy());
    }
}