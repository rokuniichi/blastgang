import { TweenType } from "./TweenType";
import { ITweenSettings } from "../settings/ITweenSettings";

export interface ITween<T extends ITweenSettings> {
    readonly type: TweenType;
    build(settings: T): cc.Tween;
}