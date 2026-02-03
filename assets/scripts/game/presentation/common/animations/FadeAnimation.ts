import { TweenType } from "./tweens/TweenType";
import { FadeSettings } from "./settings/FadeSettings";
import { IAnimation } from "./tweens/ITween";

export class FadeAnimation implements IAnimation<FadeSettings> {

    public readonly type = TweenType.FADE;

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