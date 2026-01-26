import { GameEventBus } from "../../../core/event-system/EventBus";
import { assertNotNull } from "../../../core/utils/assert";
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

    protected start() {
        assertNotNull(this.tilePrefab, this, "TilePrefab");
        assertNotNull(this.tileRoot, this, "TileRoot");
        assertNotNull(this.tileAssets, this, "TileAssets");
    }

    public init(model: BoardModel, eventBus: GameEventBus) {
        model.forEach((tile) => {
            const sprite = this.tileAssets!.getSprite(tile.type);
            const node = cc.instantiate(this.tilePrefab);
            const view = node.getComponent(TileView)!;
            view.setSprite(sprite);
            node.setParent(this.tileRoot!);
            node.setPosition(tile.x * node.width, -tile.y * node.height);
            node.getComponent(TileView)!.init(tile.x, tile.y, eventBus);
        });
    }
}
