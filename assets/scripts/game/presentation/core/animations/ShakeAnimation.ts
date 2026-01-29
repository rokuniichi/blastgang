import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";
import { ShakeSettings } from "./settings/ShakeSettings";

export class ShakeAnimation implements IAnimation<ShakeSettings> {

    public readonly type = AnimationType.SHAKE;

    play(settings: ShakeSettings): Promise<void> {
        return new Promise(resolve => {
            if (!cc.isValid(settings.node)) {
                resolve();
                return;
            }

            const startRotation = settings.node.rotation;
            cc.tween(settings.node)
                .to(0.05, { rotation: startRotation + settings.amplitude })  // Поворот влево
                .to(0.1, { rotation: startRotation - settings.amplitude })  // Поворот вправо
                .to(0.1, { rotation: startRotation + settings.amplitude })
                .to(0.05, { rotation: startRotation })
                .call(resolve)
                .start();
        });
    }
}
