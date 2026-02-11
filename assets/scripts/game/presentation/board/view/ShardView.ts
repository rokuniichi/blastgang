import { IInitializable } from "../../../../core/lifecycle/IInitializable";
import { assertNotNull } from "../../../../core/utils/assert";
import { TileType } from "../../../domain/board/models/TileType";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { BaseView } from "../../common/view/BaseView";
import { BurstMotion } from "../../fx/BurstMotion";
import { SlingMotion } from "../../fx/SlingMotion";

const { ccclass, property } = cc._decorator;

@ccclass
export class ShardView extends BaseView implements IInitializable<ShardAssets> {
    @property(cc.Sprite)
    private mainSprite: cc.Sprite = null!;

    @property(BurstMotion)
    public burst: BurstMotion = null!

    private _shards!: ShardAssets;

    public validate(): void {
        super.validate();
        assertNotNull(this.mainSprite, this, "Sprite");
        assertNotNull(this.burst, this, "BurstMotion");
    }

    public init(shards: ShardAssets): void {
        this._shards = shards;
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public set(type: TileType): void {
        this.node.color = this._shards.getColor(type);
        this.mainSprite.spriteFrame = this._shards.getSprite();
    }
}