import { IValidatable } from "../../../../core/lifecycle/IValidatable";
import { assertNotNull } from "../../../../core/utils/assert";
import { ensureNotNull } from "../../../../core/utils/ensure";
import { TileType } from "../../../domain/board/models/TileType";
import { RocketDirection } from "../../fx/RocketType";

const { ccclass, property } = cc._decorator;

@ccclass
export class RocketAssets extends cc.Component implements IValidatable {
    @property(cc.Prefab)
    private rocket: cc.Prefab = null!

    @property(cc.SpriteFrame)
    private left: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private right: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private up: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private down: cc.SpriteFrame = null!;

    private _rockets!: Map<RocketDirection, cc.SpriteFrame>;

    protected onLoad(): void {
        this.validate();
    }

    public validate(): void {
        this._rockets = new Map<RocketDirection, cc.SpriteFrame>([
            [RocketDirection.LEFT, ensureNotNull(this.left, this, "LEFT")],
            [RocketDirection.RIGHT, ensureNotNull(this.right, this, "RIGHT")],
            [RocketDirection.UP, ensureNotNull(this.up, this, "UP")],
            [RocketDirection.DOWN, ensureNotNull(this.down, this, "DOWN")],
        ]);
    }

    public getPrefab() {
        return this.rocket;
    }

    public getSprite(direction: RocketDirection): cc.SpriteFrame {
        const sprite = this._rockets.get(direction);
        assertNotNull(sprite, this, `Sprite for type ${TileType[direction]}`);
        return sprite;
    }
}