import { assertNotNull } from "../../core/utils/assert";

import { GameEvent } from "../../game/events/GameEvent";
import { GameEventBus } from "../../game/events/GameEventBus";


const {ccclass, property} = cc._decorator;

@ccclass
export class TileView extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite | null = null;

    private _x!: number;
    private _y!: number;
    private _eventBus!: GameEventBus;

    protected start(): void {
        assertNotNull(this.sprite, this, "Sprite");
    }

    public init(x: number, y: number, eventBus: GameEventBus): void {
        this._x = x;
        this._y = y;
        this._eventBus = eventBus;
    }

    public setSprite(spriteFrame: cc.SpriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
    }

    public onClick(): void {
        this._eventBus.emit(GameEvent.TILE_CLICKED, {
            x: this._x,
            y: this._y,
        });
    }
}
