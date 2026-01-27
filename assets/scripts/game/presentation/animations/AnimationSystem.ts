import { assertNotNull } from "../../../core/utils/assert";
import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export class AnimationSystem extends cc.Component {

    @property([cc.Component])
    private animationComponents: cc.Component[] = [];

    private animations: Map<AnimationType, IAnimation> = new Map();

    protected onLoad(): void {
        this.register();
    }

    private register(): void {
        for (const comp of this.animationComponents) {
            const anim = comp as unknown as IAnimation;
            this.animations.set(anim.type, anim);
        }
    }

    public play(type: AnimationType, target: cc.Node): Promise<void> {
        const animation = this.animations.get(type);
        assertNotNull(animation, this, `Animation "${type}" not registered`);
        return animation.play(target);
    }

    public has(type: AnimationType): boolean {
        return this.animations.has(type);
    }
}