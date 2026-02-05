import { ITweenSettings } from "./ITweenSettings";

export interface FlashSettings extends ITweenSettings {
    node: cc.Node;
    durationIn: number;
    scaleIn: number;
    durationOut: number;
    scaleOut: number;
    peakOpacity: number;
}