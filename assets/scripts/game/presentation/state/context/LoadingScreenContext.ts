import { TweenHelper } from "../../common/animations/TweenHelper";
import { EventViewContext } from "../../common/context/EventViewContext";

export interface LoadingScreenContext extends EventViewContext {
    readonly tweenHelper: TweenHelper;
 }