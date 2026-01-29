import { IAnimationSettings } from "../IAnimationSettings";

export interface FadeSettings extends IAnimationSettings {
    duration: number;
    targetOpacity: number;
}