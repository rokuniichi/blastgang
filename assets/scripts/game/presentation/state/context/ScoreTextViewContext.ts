import { DynamicTextViewContext } from "../../common/context/DynamicTextViewContext";

export interface ScoreTextViewContext extends DynamicTextViewContext {
    readonly targetScore: number;
 }