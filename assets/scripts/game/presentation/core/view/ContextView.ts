import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { IInitializable } from "../../../../core/lifecycle/IInitializable";
import { IValidatable } from "../../../../core/lifecycle/IValidatable";
import { assertNotNull } from "../../../../core/utils/assert";


export abstract class ContextView<TContext> extends cc.Component implements IInitializable<TContext>, IDisposable, IValidatable {
    
    protected context!: TContext;

    private _initialized: boolean = false;

    protected onLoad(): void {
        this.validate();
    }

    protected onDestroy(): void {
        this.dispose();
    }

    public validate(): void { }

    public init(context: TContext): void {
        if (this._initialized) return;
        assertNotNull(context, this, "context");    
        this.context = context;
        this.preInit();
        this.onInit();
        this.postInit();
        this._initialized = true;
    }

    protected abstract preInit(): void;
    protected abstract onInit(): void;
    protected postInit(): void { }

    public dispose(): void {
        if (!this._initialized) return;
        this.onDispose();
        this._initialized = false;
    }

    protected onDispose(): void { }
}
