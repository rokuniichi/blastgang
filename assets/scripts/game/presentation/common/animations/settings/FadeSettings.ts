import { ITweenSettings } from "./ITweenSettings";

export interface FadeSettings extends ITweenSettings {
    duration: number;
    targetOpacity: number;
}