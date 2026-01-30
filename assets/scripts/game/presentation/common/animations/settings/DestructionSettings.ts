import { IAnimationSettings } from "../IAnimationSettings";

export interface DestructionSettings extends IAnimationSettings {
    squashDuration: number;
    squashScale: number;
    popDuration: number;
    popScale: number;
    shrinkDuration: number;
    shrinkOpacity: number;
    shrinkScale: number;
}