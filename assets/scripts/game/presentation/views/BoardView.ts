
import { Matrix } from "../../../core/collections/Matrix";
import { ensureNotNull } from "../../../core/utils/ensure";
import { BoardModel } from "../../domain/models/BoardModel";
import { TileType } from "../../domain/models/TileType";
import { TileAssets } from "../assets/TileAssets";
import { TilesUpdatedEvent } from "../events/TilesUpdatedEvent";
import { BaseView } from "./BaseView";
import { TileView } from "./TileView";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends BaseView {
    @property(cc.Prefab)
    tilePrefab: cc.Prefab | null = null;

    @property(cc.Node)
    tileRoot: cc.Node | null = null;

    @property(TileAssets)
    tileAssets: TileAssets | null = null;

    private _board!: BoardModel;
    private _views!: Matrix<TileView>;

    protected onInit(board: BoardModel): void {
        this._board = board;

        const prefab = ensureNotNull(this.tilePrefab, this, "tilePrefab");
        const root = ensureNotNull(this.tileRoot, this, "tileRoot");

        this._views = new Matrix<TileView>(board.width, board.height, () => {
            const node = cc.instantiate(prefab);
            node.setParent(root);
            return ensureNotNull(node.getComponent(TileView), this, "TileView");
        });
    }

    protected subscribe(): void {
        this.on(TilesUpdatedEvent, this.onTilesUpdated)
    }

    private onTilesUpdated(event: TilesUpdatedEvent): void {
        const assets = ensureNotNull(this.tileAssets, this, "tileAssets");

        for (const pos of event.tiles) {
            const type = this._board.get(pos.x, pos.y);
            const view = this._views.get(pos.x, pos.y);

            if (type === TileType.NONE) {
                view.hide();
            } else {
                view.show();
                view.setSprite(assets.getSprite(type));
            }
        }
    }
}