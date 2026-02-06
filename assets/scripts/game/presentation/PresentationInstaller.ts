import { ILifecycle } from "../../core/lifecycle/ILifecycle";
import { PresentationReady } from "./board/events/PresentationReady";
import { BaseView } from "./common/view/BaseView";
import { PresentationView } from "./common/view/PresentationView";
import { PresentationGraph } from "./PresentationGraph";

const { ccclass } = cc._decorator;

@ccclass
export class PresentationInstaller extends BaseView implements ILifecycle {
    private _views!: PresentationView<any>[];
    private _presentation!: PresentationGraph;

    public prepare(presentation: PresentationGraph): void {
        this._presentation = presentation;
    }

    public init(): void {
        this._views = this.node.getComponentsInChildren(PresentationView);
        for (const view of this._views) {
            const constructor = view.contextConstructor();
            const context = new constructor(this._presentation);
            view.init(context);
        }

        this._presentation.eventBus.emit(new PresentationReady());
    }

    public dispose(): void {
        this._views.forEach((view) => view.destroy());
    }
}