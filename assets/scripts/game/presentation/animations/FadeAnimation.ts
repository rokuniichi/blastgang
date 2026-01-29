import { AnimationType } from "./AnimationType";
import { FadeSettings } from "./settings/FadeSettings";
import { IAnimation } from "./IAnimation";

export class FadeAnimation implements IAnimation<FadeSettings> {

    public readonly type = AnimationType.FADE;

    play(settings: FadeSettings): Promise<void> {
        const { node, duration, targetOpacity } = settings;

        return new Promise(resolve => {
            if (!cc.isValid(node)) {
                resolve();
                return;
            }

            cc.tween(node)
                .to(duration, { opacity: targetOpacity }, { easing: "quadOut" })
                .call(resolve)
                .start();
        });
    }
}