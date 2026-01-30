import { IAnimationSettings } from "../IAnimationSettings";

export interface ShakeSettings extends IAnimationSettings{
    node: cc.Node;
    duration: number;
    amplitude: number;
}