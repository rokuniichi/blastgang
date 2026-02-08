import { assertNotNull } from "../../../../core/utils/assert";
import { BaseView } from "../../common/view/BaseView";
import { IHighlightable } from "../../common/view/IHighlightable";
import { DropMotion } from "../../fx/DropMotions";
import { SlingMotion } from "../../fx/SlingMotion";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends BaseView implements IHighlightable {
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

    public validate(): void {
        super.validate();
        assertNotNull(this.mainSprite, this, "Sprite");
        assertNotNull(this.drop, this, "DropMotion");
        assertNotNull(this.sling, this, "SlingMotion");
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

    public set(mainSpriteFrame: cc.SpriteFrame, highlightSpriteFrame: cc.SpriteFrame): void {
        this.mainSprite.spriteFrame = mainSpriteFrame;
        this.highlightSprite.spriteFrame = highlightSpriteFrame;
    }

    public stabilize(): void {
        this.highlight(false);
        this.node.setScale(1, 1);
        this.node.angle = 0;
        this.node.opacity = 255;
        this.node.active = true;
    }
}