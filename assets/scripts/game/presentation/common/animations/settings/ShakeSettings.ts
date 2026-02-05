import { TweenType } from "../tweens/TweenType";
import { ITweenSettings } from "./ITweenSettings";

export interface ShakeSettings extends ITweenSettings {
    type: TweenType.SHAKE;
    
    node: cc.Node;
    duration: number;
    amplitude: number;
}