import { assertNotNull } from "../../../../core/utils/assert";
import { TileType } from "../../../domain/board/models/TileType";
import { TileAssets } from "../../common/assets/TileAssets";
import { ContextView } from "../../common/view/ContextView";
import { TileViewContext } from "../context/TileViewContext";


const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends ContextView<TileViewContext> {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null!;

    @property(TileAssets)
    private tileAssets: TileAssets = null!;

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

    public set(type: TileType): void {
        const spriteFrame = this.tileAssets.get(type);
        this.sprite.spriteFrame = spriteFrame;
    }

    public stabilize(): void {
        this.node.setScale(1, 1);
        this.node.angle = 0;
        this.node.opacity = 255;
        this.node.active = true;
    }
}