import { ITweenSettings } from "./ITweenSettings";

export interface DestructionSettings extends ITweenSettings {
    squashDuration: number;
    squashScale: number;
    popDuration: number;
    popScale: number;
    shrinkDuration: number;
    shrinkOpacity: number;
    shrinkScale: number;
}