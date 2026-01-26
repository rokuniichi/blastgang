import { EventBus } from "../../../core/event-system/EventBus";
import { assert, assertNotNull } from "../../../core/utils/assert";
import { TileClickedEvent } from "../events/TileClickedEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite | null = null;

    private _x!: number;
    private _y!: number;
    private _eventBus!: EventBus;

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    public init(x: number, y: number, spriteFrame: cc.SpriteFrame, eventBus: EventBus): void {
        assertNotNull(this.sprite, this, "Sprite");

        this._x = x;
        this._y = y;
        this.sprite.spriteFrame = spriteFrame;
        this._eventBus = eventBus;

        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    public setSprite(spriteFrame: cc.SpriteFrame): void {
        this.sprite!.spriteFrame = spriteFrame;
    }

    public onClick(): void {
        assertNotNull(this._eventBus, this, "this._eventBus");
        this._eventBus.emit(new TileClickedEvent(this._x, this._y));
    }
}