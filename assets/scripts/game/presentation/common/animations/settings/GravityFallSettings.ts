import { IAnimationSettings } from "../IAnimationSettings";

export interface GravityFallSettings extends IAnimationSettings{
    duration: number;
    targetY: number;
    bounce: number;
    bounceDuration: number;
    settleDuration: number;
    easing: string;
}