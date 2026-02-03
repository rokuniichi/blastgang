import { EventBus } from "../../../../core/events/EventBus";
import { TileView } from "./TileView";

export class TileViewPool {
    private pool: TileView[] = [];

    constructor(
        private readonly _eventBus: EventBus,
        private readonly _prefab: cc.Prefab,
        private readonly _parent: cc.Node
    ) { }

    public pull(): TileView {
        let view = this.pool.pop();
        if (!this.isValid(view)) {
            const node = cc.instantiate(this._prefab);
            view = node.getComponent(TileView)!;
        }
        view!.init({ eventBus: this._eventBus });
        view!.node.setParent(this._parent);
        return view!;
    }

    public release(view: TileView) {
        if (!this.isValid(view)) return;
        cc.Tween.stopAllByTarget(view.node);
        view.node.active = false;
        view.node.removeFromParent(false);
        this.pool.push(view);
    }

    private isValid(view: TileView | undefined): boolean {
        if (!view) return false;
        return cc.isValid(view) && cc.isValid(view.node);
    }
}