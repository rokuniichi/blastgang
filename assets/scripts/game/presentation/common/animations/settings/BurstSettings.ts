import { ITweenSettings } from "./ITweenSettings";

export interface BurstSettings extends ITweenSettings {
    node: cc.Node;
    duration: number;
}