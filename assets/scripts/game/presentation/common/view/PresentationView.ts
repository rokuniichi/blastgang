import { PresentationGraph } from "../../PresentationGraph";
import { PresentationViewContext } from "./PresentationViewContext";
import { ContextView } from "./ContextView";

export type PresentationViewContextConstructor<T> = new (presentation: PresentationGraph) => T;

export abstract class PresentationView<TContext extends PresentationViewContext> extends ContextView<TContext> {
    public abstract contextConstructor(): PresentationViewContextConstructor<TContext>;
}