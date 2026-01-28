import { EventViewContext } from "./EventViewContext";

export interface DynamicTextViewContext extends EventViewContext { 
    readonly initialValue: number;
}