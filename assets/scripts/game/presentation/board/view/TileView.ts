import { assertNotNull } from "../../../../core/utils/assert";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileClickedEvent } from "../../core/events/TileClickedEvent";
import { EventView } from "../../core/view/EventView";
import { TileViewContext } from "../context/TileViewContext";


const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends EventView<TileViewContext> {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null!;

    private position!: TilePosition;

    public validate(): void {
        super.validate();
        assertNotNull(this.sprite, this, "Sprite");
    }

    protected preInit(): void {
        super.preInit();
        assertNotNull(this.context.position, this, "boardModel");
    }

    protected onInit(): void {
        this.position = this.context.position;
    }

    protected postInit(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    protected onDispose(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick(): void {
        this.emit(new TileClickedEvent(this.position));
    }

    public show(): void {
        this.node.active = true;
        this.sprite.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
        this.sprite.node.active = false;
    }

    public set(spriteFrame: cc.SpriteFrame): void {
        this.sprite.spriteFrame = spriteFrame;
    }

    public get(): cc.Node {
        return this.sprite.node;
    }
}