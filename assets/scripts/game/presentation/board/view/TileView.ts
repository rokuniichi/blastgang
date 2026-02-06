import { assertNotNull } from "../../../../core/utils/assert";
import { BaseView } from "../../common/view/BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends BaseView {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null!;

    public validate(): void {
        super.validate();
        assertNotNull(this.sprite, this, "Sprite");
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public set(spriteFrame: cc.SpriteFrame): void {
        this.sprite.spriteFrame = spriteFrame;
    }

    public stabilize(): void {
        this.node.setScale(1, 1);
        this.node.angle = 0;
        this.node.opacity = 255;
        this.node.active = true;
    }
}