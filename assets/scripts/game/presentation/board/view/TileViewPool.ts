import { EventBus } from "../../../../core/events/EventBus";
import { assertNotNull } from "../../../../core/utils/assert";
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

        assertNotNull(view, this, "pool is broken");

        view.node.setParent(this._parent);
        view.node.setPosition(0, 0);   // 🔥 ВАЖНО
        view.node.setScale(1, 1);
        view.node.angle = 0;
        view.node.opacity = 255;
        view.node.active = true;

        view.init({ eventBus: this._eventBus });
        return view;
    }

    public release(view: TileView) {
        if (!this.isValid(view)) return;
        cc.Tween.stopAllByTarget(view.node);
        view.hide();
        view.node.removeFromParent();
        this.pool.push(view);
    }

    private isValid(view: TileView | undefined): boolean {
        if (!view) return false;
        return cc.isValid(view) && cc.isValid(view.node);
    }
}