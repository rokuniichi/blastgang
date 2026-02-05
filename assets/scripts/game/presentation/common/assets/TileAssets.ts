import { IValidatable } from "../../../../core/lifecycle/IValidatable";
import { assertNotNull } from "../../../../core/utils/assert";
import { ensureNotNull } from "../../../../core/utils/ensure";
import { TileType } from "../../../domain/board/models/TileType";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileAssets extends cc.Component implements IValidatable {
    @property(cc.Prefab)
    private tile: cc.Prefab = null!

    @property(cc.SpriteFrame)
    private empty: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private red: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private green: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private blue: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private purple: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private yellow: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private bomb: cc.SpriteFrame = null!;

    private _map!: Map<TileType, cc.SpriteFrame>;

    protected onLoad(): void {
        this.validate();
    }

    public validate(): void {
        this._map = new Map<TileType, cc.SpriteFrame>([
            [TileType.EMPTY, ensureNotNull(this.empty, this, "EMPTY")],
            [TileType.RED, ensureNotNull(this.red, this, "RED")],
            [TileType.GREEN, ensureNotNull(this.green, this, "GREEN")],
            [TileType.BLUE, ensureNotNull(this.blue, this, "BLUE")],
            [TileType.PURPLE, ensureNotNull(this.purple, this, "PURPLE")],
            [TileType.YELLOW, ensureNotNull(this.yellow, this, "YELLOW")],
            [TileType.BOMB, ensureNotNull(this.bomb, this, "BOMB")]
        ]);
    }

    public getPrefab() {
        return this.tile;
    }

    public getSprite(type: TileType): cc.SpriteFrame {
        const sprite = this._map.get(type);
        assertNotNull(sprite, this, `Sprite for type ${TileType[type]}`);
        return sprite;
    }
}