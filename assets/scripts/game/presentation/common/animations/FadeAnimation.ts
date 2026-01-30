import { AnimationType } from "./AnimationType";
import { FadeSettings } from "./settings/FadeSettings";
import { IAnimation } from "./IAnimation";

export class FadeAnimation implements IAnimation<FadeSettings> {

    public readonly type = AnimationType.FADE;

    play(settings: FadeSettings): Promise<void> {

        return new Promise(resolve => {
            if (!cc.isValid(settings.node)) {
                resolve();
                return;
            }

            cc.tween(settings.node)
                .to(settings.duration, { opacity: settings.targetOpacity }, { easing: "quadOut" })
                .call(resolve)
                .start();
        });
    }
}