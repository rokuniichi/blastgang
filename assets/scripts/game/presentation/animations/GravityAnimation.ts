import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export class GravityAnimation extends cc.Component implements IAnimation {

    @property
    public squashDuration = 0.12;

    @property
    public popDuration = 0.18;

    @property
    public fadeDuration = 0.2;

    @property
    public squashX = 0.92;

    @property
    public squashY = 1.05;

    @property
    public popScale = 1.15;

    @property
    public finalScale = 0.6;

    @property
    public finalOpacity = 80;

    public readonly type: AnimationType = AnimationType.DESTRUCTION;

    public play(target: cc.Node): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!cc.isValid(target)) {
                resolve();
                return;
            }

            const originalScale = target.scale;
            const originalOpacity = target.opacity;

            cc.tween(target)
                .to(this.squashDuration, {
                    scaleX: originalScale * this.squashX,
                    scaleY: originalScale * this.squashY
                }, { easing: "sineOut" })

                .to(this.popDuration, {
                    scale: originalScale * this.popScale
                }, { easing: "quadOut" })

                .parallel(
                    cc.tween().to(this.fadeDuration, {
                        opacity: this.finalOpacity
                    }, { easing: "sineIn" }),

                    cc.tween().to(this.fadeDuration, {
                        scale: originalScale * this.finalScale
                    }, { easing: "quadIn" })
                )

                .call(() => {
                    target.scale = originalScale;
                    target.opacity = originalOpacity;

                    resolve();
                })
                .start();
        });
    }
}
