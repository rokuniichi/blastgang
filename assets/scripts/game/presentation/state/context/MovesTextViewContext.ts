import { DynamicTextViewContext } from "../../core/context/DynamicTextViewContext";

export interface MovesTextViewContext extends DynamicTextViewContext {
    readonly initialMoves: number;
}