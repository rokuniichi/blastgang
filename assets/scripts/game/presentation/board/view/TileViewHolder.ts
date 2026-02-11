import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { assertNotNull } from "../../../../core/utils/assert";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../domain/board/models/TileType";
import { TileAssets } from "../../common/assets/TileAssets";
import { NodePool } from "../../common/view/NodePool";
import { TileView } from "./TileView";

export class TileViewHolder implements IDisposable {
    private readonly _tiles: TileAssets;

    private readonly _map: Map<TileId, TileView>;
    private readonly _pool: NodePool;

    constructor(tiles: TileAssets, parent: cc.Node, size: number) {
        this._tiles = tiles;

        this._map = new Map<TileId, TileView>;
        this._pool = new NodePool(this._tiles.getPrefab(), parent, size);
    }

    public dispose(): void {
        this._pool.dispose();
    }

    public pull(id: TileId, type: TileType): TileView {
        const node = this._pool.pull();
        const view = node.getComponent(TileView);
        assertNotNull(view, this, "pool is broken");
        view.init(this._tiles);
        view.set(type);
        this._map.set(id, view);
        return view;
    }

    public release(id: TileId) {
        const view = this._map.get(id);
        if (!view) return;
        this._pool.release(view.node);
        view.hide();
        this._map.delete(id);
    }
}