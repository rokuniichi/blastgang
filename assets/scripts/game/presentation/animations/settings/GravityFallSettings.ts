import { IAnimationSettings } from "../IAnimationSettings";

export interface GravityFallSettings extends IAnimationSettings {
    duration: number;
    startOffsetY: number;
    bounce: number;
    easing: string;
}