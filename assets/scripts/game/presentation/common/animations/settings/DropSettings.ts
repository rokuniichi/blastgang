import { ITweenSettings } from "./ITweenSettings";

export interface DropSettings extends ITweenSettings {
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