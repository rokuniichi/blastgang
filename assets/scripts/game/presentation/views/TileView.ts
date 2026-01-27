import { assertNotNull } from "../../../core/utils/assert";
import { TilePosition } from "../../domain/board/models/TilePosition";
import { TileViewContext } from "../context/TileViewContext";
import { TileClickedEvent } from "../events/TileClickedEvent";
import { EventView } from "./EventView";


const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends EventView<TileViewContext> {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null!;

     @property(cc.Node)
    private target: cc.Node | null = null;

    private position!: TilePosition;

    public override validate(): void {
        assertNotNull(this.sprite, this, "Sprite");
    }

    protected override onInit(): void {
        this.position = this.context.position;
    }

    protected override subscribe(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    protected override unsubscribe(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick(): void {
        this.emit(new TileClickedEvent(this.position));
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

    public getTarget(): cc.Node {
        return this.target ?? this.node;
    }
}