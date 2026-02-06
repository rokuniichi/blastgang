import { ITweenSettings } from "./ITweenSettings";

export interface DropSettings extends ITweenSettings {
    node: cc.Node;
    duration: number;
}