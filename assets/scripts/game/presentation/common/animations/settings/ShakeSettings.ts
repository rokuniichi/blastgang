import { ITweenSettings } from "./ITweenSettings";

export interface ShakeSettings extends ITweenSettings{
    node: cc.Node;
    duration: number;
    amplitude: number;
}