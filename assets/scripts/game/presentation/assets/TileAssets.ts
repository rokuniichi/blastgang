// ui/assets/TileAssets.ts
import { assertNotNull } from "../../../core/utils/assert";
import { ensureNotNull } from "../../../core/utils/ensure";
import { TileType } from "../../domain/models/TileType";
import { BaseView } from "../views/BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileAssets extends BaseView {
    @property(cc.SpriteFrame)
    red!: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    green!: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    blue!: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    purple!: cc.SpriteFrame;

    @property(cc.SpriteFrame)
    yellow!: cc.SpriteFrame;

    private _map!: Map<TileType, cc.SpriteFrame>;

    protected validate(): void {
        this._map = new Map<TileType, cc.SpriteFrame>([
            [TileType.RED, ensureNotNull(this.red, this, "RED")],
            [TileType.GREEN, ensureNotNull(this.green, this, "GREEN")],
            [TileType.BLUE, ensureNotNull(this.blue, this, "BLUE")],
            [TileType.PURPLE, ensureNotNull(this.purple, this, "PURPLE")],
            [TileType.YELLOW, ensureNotNull(this.yellow, this, "YELLOW")],
        ]);
    }

    public getSprite(type: TileType): cc.SpriteFrame {
        const sprite = this._map.get(type);
        assertNotNull(sprite, this, `Sprite for type ${TileType[type]}`);
        return sprite;
    }
}