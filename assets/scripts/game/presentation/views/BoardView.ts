
import { Matrix } from "../../../core/collections/Matrix";
import { assertNotNull } from "../../../core/utils/assert";
import { ensureNotNull } from "../../../core/utils/ensure";
import { BoardModel } from "../../domain/models/BoardModel";
import { TilePosition } from "../../domain/models/TilePosition";
import { TileType } from "../../domain/models/TileType";
import { TileAssets } from "../assets/TileAssets";
import { TilesUpdatedEvent } from "../events/TilesUpdatedEvent";
import { SubscriberView } from "./SubscriberView";
import { TileView } from "./TileView";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends SubscriberView {
    @property(cc.Prefab)
    tilePrefab!: cc.Prefab;

    @property(cc.Node)
    tileRoot!: cc.Node;

    @property(TileAssets)
    tileAssets!: TileAssets;

    private _board!: BoardModel;
    private _views!: Matrix<TileView>;

    protected validate(): void {
        assertNotNull(this.tilePrefab, this, "tilePrefab");
        assertNotNull(this.tileRoot, this, "TileRoot");
        assertNotNull(this.tileAssets, this, "TileAssets");
    }

    protected onInit(board: BoardModel): void {
        this._board = board;
        this._views = new Matrix<TileView>(board.width, board.height, (x, y) => {
            const node = cc.instantiate(this.tilePrefab);
            node.setParent(this.tileRoot);
            node.setPosition(x * node.width, -y * node.height);

            return ensureNotNull(node.getComponent(TileView), this, "TileView")
        });

        this.syncViews();
    }

    protected subscribe(): void {
        this.on(TilesUpdatedEvent, this.onTilesUpdated)
    }

    private onTilesUpdated = (event: TilesUpdatedEvent): void => {
        for (const position of event.tiles) {
            this.updateView(position)
        }
    }

    private syncViews(): void {
        this._board.forEach((_, position) => this.updateView(position));
    }

    private updateView(position: TilePosition): void {
        const type = this._board.get(position);
        const view = this.getView(position);
        
        if (type === TileType.NONE) {
            view.hide();
            return;
        }

        view.show();
        view.setSprite(this.tileAssets.getSprite(type));
    }

    private getView(position: TilePosition): TileView {
        return this._views.get(position.x, position.y);
    }
}