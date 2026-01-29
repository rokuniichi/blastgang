import { AnimationType } from "./AnimationType";
import { IAnimationSettings } from "./IAnimationSettings";

export interface IAnimation<T extends IAnimationSettings> {
    type: AnimationType;
    play(settings: T): Promise<void>;
}