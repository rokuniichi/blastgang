import { ILifecycle } from "../../../../core/lifecycle/ILifecycle";
import { assertNotNull } from "../../../../core/utils/assert";
import { BaseView } from "./BaseView";

export abstract class ContextView<TContext> extends BaseView implements ILifecycle<TContext> {
    protected context!: TContext;

    private _initialized: boolean = false;

    public init(context: TContext): void {
        if (this._initialized) return;
        assertNotNull(context, this, "context");
        this.context = context;
        this.preInit();
        this.onInit();
        this.postInit();
        this._initialized = true;
    }

    protected preInit(): void { };
    protected onInit(): void { };
    protected postInit(): void { }

    public dispose(): void {
        if (!this._initialized) return;
        this.onDispose();
        this._initialized = false;
    }

    protected onDestroy(): void {
        this.dispose();
    }

    protected onDispose(): void { }
}
