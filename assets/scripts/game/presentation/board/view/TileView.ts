import { IInitializable } from "../../../../core/lifecycle/IInitializable";
import { assertNotNull } from "../../../../core/utils/assert";
import { TileType } from "../../../domain/board/models/TileType";
import { TileAssets } from "../../common/assets/TileAssets";
import { BaseView } from "../../common/view/BaseView";
import { IHighlightable } from "../../common/view/IHighlightable";
import { DropMotion } from "../../fx/DropMotions";
import { SlingMotion } from "../../fx/SlingMotion";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends BaseView implements IInitializable<TileAssets>, IHighlightable {
    @property(cc.Sprite)
    private mainSprite: cc.Sprite = null!;

    @property(cc.Node)
    private highlightRoot: cc.Node = null!;

    @property(cc.Sprite)
    private highlightSprite: cc.Sprite = null!;

    @property(DropMotion)
    public drop: DropMotion = null!

    @property(SlingMotion)
    public sling: SlingMotion = null!

    private _assets!: TileAssets;

    public validate(): void {
        super.validate();
        assertNotNull(this.mainSprite, this, "Sprite");
        assertNotNull(this.drop, this, "DropMotion");
        assertNotNull(this.sling, this, "SlingMotion");
    }

    init(assets: TileAssets): void {
        this._assets = assets;
    }

    public highlight(state: boolean): void {
        this.highlightRoot.active = state;
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public set(type: TileType): void {
        this.mainSprite.spriteFrame = this._assets.getMainSprite(type);;
        this.highlightSprite.spriteFrame = this._assets.getHighlightSprite(type);;
    }

    public stabilize(): void {
        this.highlight(false);
        this.node.setScale(1, 1);
        this.node.angle = 0;
        this.node.opacity = 255;
        this.node.active = true;
    }
}