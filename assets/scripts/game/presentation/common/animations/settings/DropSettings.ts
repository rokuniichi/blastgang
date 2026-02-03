import { TweenType } from "../tweens/TweenType";

export interface DropSettings {
    type: TweenType.DROP;
    node: cc.Node;
    fromY: number;
    toY: number;
    speed: number; // units per second (или tileHeight * cps)
    easing: string;

    bounce: number;
    bounceDuration: number;
    settleDuration: number;

}