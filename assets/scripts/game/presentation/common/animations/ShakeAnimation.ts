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

            const startAngle = settings.node.angle;
            cc.tween(settings.node)
                .to(settings.duration, { angle: startAngle + settings.amplitude })  // Поворот влево
                .to(settings.duration * 2, { angle: startAngle - settings.amplitude })  // Поворот вправо
                .to(settings.duration * 2, { angle: startAngle + settings.amplitude })
                .to(settings.duration, { angle: startAngle })
                .call(resolve)
                .start();
        });
    }
}
