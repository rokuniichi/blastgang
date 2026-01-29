import { AnimationType } from "./AnimationType";
import { DestructionSettings } from "./settings/DestructionSettings";
import { IAnimation } from "./IAnimation";


export class DestructionAnimation implements IAnimation<DestructionSettings> {

    public readonly type = AnimationType.DESTRUCTION;

    play(settings: DestructionSettings): Promise<void> {
        const {
            node,
            squashDuration,
            popDuration,
            fadeDuration,
            squashX,
            squashY,
            popScale,
            finalScale,
            finalOpacity
        } = settings;

        return new Promise(resolve => {
            if (!cc.isValid(node)) {
                resolve();
                return;
            }

            
        });
    }
}