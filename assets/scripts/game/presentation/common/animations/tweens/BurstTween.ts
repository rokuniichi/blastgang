import { BurstSettings } from "../settings/BurstSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class BurstTween implements ITween<BurstSettings> {

    public readonly type = TweenType.BURST;

    public build(settings: BurstSettings): cc.Tween {

        return cc.tween(settings.node)
            .delay(settings.duration);
    }
}