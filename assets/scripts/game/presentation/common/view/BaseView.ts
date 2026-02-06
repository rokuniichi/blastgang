import { IValidatable } from "../../../../core/lifecycle/IValidatable";

export abstract class BaseView extends cc.Component implements IValidatable {
    protected onLoad(): void {
        this.validate();
    }

    public validate(): void { }
}

