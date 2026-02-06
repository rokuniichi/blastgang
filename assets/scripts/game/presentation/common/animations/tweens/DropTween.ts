import { DropSettings } from "../settings/DropSettings";
import { ITween } from "./ITween";
import { TweenType } from "./TweenType";

export class DropTween implements ITween<DropSettings> {
    public readonly type = TweenType.DROP;

    public build(settings: DropSettings): cc.Tween {
        console.log(`nigga i build`);
        return cc.tween(settings.node)
            .delay(settings.duration);
    }
}