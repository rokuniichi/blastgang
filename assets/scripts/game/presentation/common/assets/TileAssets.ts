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

    @property(cc.SpriteFrame)
    private normalHighlight: cc.SpriteFrame = null!

    @property(cc.SpriteFrame)
    private bombHighlight: cc.SpriteFrame = null!

    private _mainSprites!: Map<TileType, cc.SpriteFrame>;
    private _highlightSprites!: Map<TileType, cc.SpriteFrame>;

    protected onLoad(): void {
        this.validate();
    }

    public validate(): void {
        this._mainSprites = new Map<TileType, cc.SpriteFrame>([
            [TileType.EMPTY, ensureNotNull(this.empty, this, "EMPTY")],
            [TileType.RED, ensureNotNull(this.red, this, "RED")],
            [TileType.GREEN, ensureNotNull(this.green, this, "GREEN")],
            [TileType.BLUE, ensureNotNull(this.blue, this, "BLUE")],
            [TileType.PURPLE, ensureNotNull(this.purple, this, "PURPLE")],
            [TileType.YELLOW, ensureNotNull(this.yellow, this, "YELLOW")],
            [TileType.BOMB, ensureNotNull(this.bomb, this, "BOMB")]
        ]);

        this._highlightSprites = new Map<TileType, cc.SpriteFrame>([
            [TileType.EMPTY, ensureNotNull(this.empty, this, "EMPTY")],
            [TileType.RED, ensureNotNull(this.normalHighlight, this, "NORMAL_HIGHLIGHT")],
            [TileType.GREEN, ensureNotNull(this.normalHighlight, this, "NORMAL_HIGHLIGHT")],
            [TileType.BLUE, ensureNotNull(this.normalHighlight, this, "NORMAL_HIGHLIGHT")],
            [TileType.PURPLE, ensureNotNull(this.normalHighlight, this, "NORMAL_HIGHLIGHT")],
            [TileType.YELLOW, ensureNotNull(this.normalHighlight, this, "NORMAL_HIGHLIGHT")],
            [TileType.BOMB, ensureNotNull(this.bombHighlight, this, "BOMB_HIGHLIGHT")]
        ]);
    }

    public getPrefab() {
        return this.tile;
    }

    public getMainSprite(type: TileType): cc.SpriteFrame {
        const sprite = this._mainSprites.get(type);
        assertNotNull(sprite, this, `Sprite for type ${TileType[type]}`);
        return sprite;
    }

    public getHighlightSprite(type: TileType): cc.SpriteFrame {
        const sprite = this._highlightSprites.get(type);
        assertNotNull(sprite, this, `Sprite for type ${TileType[type]}`);
        return sprite;
    }
}