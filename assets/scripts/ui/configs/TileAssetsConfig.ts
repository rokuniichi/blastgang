// ui/config/TileAssetsConfig.ts
import { assertNotNull } from "../../core/utils/assert";
import { TileType } from "../../game/models/TileType";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileAssetsConfig extends cc.Component {

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

    protected start() {
            assertNotNull(this.red, this, "Red");
            assertNotNull(this.green, this, "Green");
            assertNotNull(this.blue, this, "Blue");
            assertNotNull(this.purple, this, "Purple");
            assertNotNull(this.yellow, this, "Yellow");
        }

    public getSprite(type: TileType): cc.SpriteFrame | null {
        switch (type) {
            case TileType.RED: return this.red;
            case TileType.GREEN: return this.green;
            case TileType.BLUE: return this.blue;
            case TileType.PURPLE: return this.purple;
            case TileType.YELLOW: return this.yellow;
            default: return null;
        }
    }
}