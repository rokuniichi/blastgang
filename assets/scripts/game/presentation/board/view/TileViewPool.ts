import { EventBus } from "../../../../core/eventbus/EventBus";
import { assertNotNull } from "../../../../core/utils/assert";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../domain/board/models/TileType";
import { TileAssets } from "../../common/assets/TileAssets";
import { TileView } from "./TileView";

export class TileViewPool {
    private _pool: TileView[];
    private _map: Map<TileId, TileView>;

    constructor(
        private readonly _eventBus: EventBus,
        private readonly _tiles: TileAssets,
        private readonly _parent: cc.Node
    ) {
        this._pool = [];
        this._map = new Map();
    }

    public pull(id: TileId, type: TileType): TileView {
        let view = this._pool.pop();
        if (!view || !cc.isValid(view) || cc.isValid(view.node)) {
            const node = cc.instantiate(this._tiles.getPrefab());
            view = node.getComponent(TileView)!;
        }

        assertNotNull(view, this, "pool is broken");
        view.node.setParent(this._parent);
        view.node.setPosition(0, 0);
        view.node.setScale(1, 1);
        view.node.angle = 0;
        view.node.opacity = 255;
        view.node.active = true;
        view.set(this._tiles.getSprite(type));

        this._map.set(id, view);
        return view;
    }

    public release(id: TileId) {
        const view = this._map.get(id);

        if (!view || !cc.isValid(view) || cc.isValid(view.node)) return;

        cc.Tween.stopAllByTarget(view.node);
        view.hide();
        view.node.removeFromParent();
        this._pool.push(view);

        this._map.delete(id);
    }
}