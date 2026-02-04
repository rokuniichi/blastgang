import { TweenType } from "../tweens/TweenType";

export interface DropSettings {
    type: TweenType.DROP;
    node: cc.Node;
    fromY: number;
    toY: number;
    gravity: number;
    delay: number;

    easing: string;

    bounce: number;
    bounceDuration: number;
    settleDuration: number;

}