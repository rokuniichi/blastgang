import { ITweenSettings } from "./ITweenSettings";

export interface PulseSettings extends ITweenSettings {
    node: cc.Node;
    durationIn: number;
    scaleIn: number;
    durationOut: number;
    scaleOut: number;
}