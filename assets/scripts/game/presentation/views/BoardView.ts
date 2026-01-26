import { EventBus } from "../../../core/event-system/EventBus";
import { assertNotNull } from "../../../core/utils/assert";
import { ensureNotNull } from "../../../core/utils/ensure";
import { BoardModel } from "../../domain/models/BoardModel";
import { TileAssets } from "../assets/TileAssets";
import { TileView } from "./TileView";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends cc.Component {
    @property(cc.Prefab)
    tilePrefab: cc.Prefab | null = null;

    @property(cc.Node)
    tileRoot: cc.Node | null = null;

    @property(TileAssets)
    tileAssets: TileAssets | null = null;

    public init(model: BoardModel, eventBus: EventBus) {
        const prefab = ensureNotNull(this.tilePrefab, this, "TilePrefab");
        const root = ensureNotNull(this.tileRoot, this, "TileRoot");
        const assets = ensureNotNull(this.tileAssets, this, "TileAssets");

        model.forEach((tile) => {
            const node = cc.instantiate(prefab);
            const view = ensureNotNull(node.getComponent(TileView), this, "TileView");
            const sprite = assets.getSprite(tile.type);

            view.init(tile.x, tile.y, sprite, eventBus);

            node.setParent(root);
            node.setPosition(tile.x * node.width, -tile.y * node.height);
        });
    }
}
