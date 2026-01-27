import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";

export abstract class BaseAnimation implements IAnimation {

    public abstract readonly type: AnimationType;

    public abstract play(target: cc.Node): Promise<void>;

    protected ensureTarget(target: cc.Node): cc.Node {
        if (!target || !cc.isValid(target)) {
            throw new Error(`[${this.constructor.name}] target is invalid`);
        }
        return target;
    }
}