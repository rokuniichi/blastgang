import { TweenType as TweenType } from "../tweens/TweenType";

export interface ITweenSettings {
    type: TweenType;
    node: cc.Node;
}