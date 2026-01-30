import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { IInitializable } from "../../../../core/lifecycle/IInitializable";

export abstract class BaseController implements IInitializable, IDisposable {

    private _initialized = false;

    public init(): void {
        if (this._initialized) return;
        this._initialized = true;

        this.onInit();
    }

    protected abstract onInit(): void;

    public dispose(): void {
        if (!this._initialized) return;

        this.onDispose();
    }

    protected onDispose(): void { }
}