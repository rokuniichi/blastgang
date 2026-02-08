import { PresentationGraph } from "../../PresentationGraph";
import { PresentationViewContext } from "./PresentationViewContext";
import { ContextView } from "./ContextView";

export type PresentationViewContextFactory<T> = (presentation: PresentationGraph) => T;

export abstract class PresentationView<TContext extends PresentationViewContext> extends ContextView<TContext> {
    public abstract contextFactory(): PresentationViewContextFactory<TContext>;
}