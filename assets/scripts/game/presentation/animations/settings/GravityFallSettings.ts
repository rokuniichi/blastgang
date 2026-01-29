import { IAnimationSettings } from "../IAnimationSettings";

export interface GravityFallSettings extends IAnimationSettings {
    delay: number;
    duration: number;
    startY: number;
    delta: number;
    bounce: number;
    bounceDuration: number;
    settleDuration: number;
    easing: string;
}