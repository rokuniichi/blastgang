import { DynamicTextViewContext } from "../../core/context/DynamicTextViewContext";

export interface ScoreTextViewContext extends DynamicTextViewContext {
    readonly targetScore: number;
 }