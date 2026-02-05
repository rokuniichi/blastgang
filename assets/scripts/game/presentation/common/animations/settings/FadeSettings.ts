import { ITweenSettings } from "./ITweenSettings";

export interface FadeSettings extends ITweenSettings {  
    delay: number;
    duration: number;
    opacity: number;
}