import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { IInitializable } from "../../../../core/lifecycle/IInitializable";
import { IValidatable } from "../../../../core/lifecycle/IValidatable";


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
        this.context = context;
        this.preInit();
        this.onInit();
        this.postInit();
        this._initialized = true;
    }

    protected preInit(): void { }
    protected abstract onInit(): void;
    protected postInit(): void { }

    public dispose(): void {
        if (!this._initialized) return;
        this.onDispose();
        this._initialized = false;
    }

    protected onDispose(): void { }
}
