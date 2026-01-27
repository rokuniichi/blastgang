export abstract class BaseView extends cc.Component {
    protected onLoad(): void {
        this.validate();
    }
    protected abstract validate(): void;
}