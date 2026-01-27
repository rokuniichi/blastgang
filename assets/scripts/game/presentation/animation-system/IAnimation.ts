import { AnimationType } from "./AnimationType";

export interface IAnimation {
    readonly type: AnimationType;
    play(target: cc.Node): Promise<void>;
}