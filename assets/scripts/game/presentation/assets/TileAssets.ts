// ui/assets/TileAssets.ts
import { assertNotNull } from "../../../core/utils/assert";
import { ensureNotNull } from "../../../core/utils/ensure";
import { TileType } from "../../domain/models/TileType";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileAssets extends cc.Component {

    @property(cc.SpriteFrame)
    red: cc.SpriteFrame | null = null;

    @property(cc.SpriteFrame)
    green: cc.SpriteFrame | null = null;

    @property(cc.SpriteFrame)
    blue: cc.SpriteFrame | null = null;

    @property(cc.SpriteFrame)
    purple: cc.SpriteFrame | null = null;

    @property(cc.SpriteFrame)
    yellow: cc.SpriteFrame | null = null;

    private _map!: Map<TileType, cc.SpriteFrame>;

    protected onLoad(): void {
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