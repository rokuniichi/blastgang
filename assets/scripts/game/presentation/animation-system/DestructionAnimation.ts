import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export class DestructionAnimation extends cc.Component implements IAnimation {
    @property
    public duration: number = 0.25;

    @property
    public scaleMultiplier: number = 1.4;

    @property
    public fadeOut: boolean = true;

    public readonly type: AnimationType = AnimationType.DESTRUCTION;

    public play(target: cc.Node): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!cc.isValid(target)) {
                resolve();
                return;
            }

            const tween = cc.tween(target)
                .to(this.duration, {
                    scale: target.scale * this.scaleMultiplier
                });

            if (this.fadeOut) {
                tween.to(this.duration, { opacity: 0 });
            }

            tween.call(resolve).start();
        });
    }
}