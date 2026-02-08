import { PresentationGraph } from "../../PresentationGraph";
import { EventViewContext } from "./EventViewContext";

export abstract class DynamicTextViewContext extends EventViewContext {
    public initial: number = -1;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
    }

    protected setInitial(value: number | undefined): void {
        this.initial = value ?? -1;
    }
}