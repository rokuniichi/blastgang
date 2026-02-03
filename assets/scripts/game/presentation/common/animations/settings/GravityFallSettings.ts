import { ITweenSettings } from "./ITweenSettings";

export interface GravityFallSettings extends ITweenSettings{
    duration: number;
    targetY: number;
    bounce: number;
    bounceDuration: number;
    settleDuration: number;
    easing: string;
}