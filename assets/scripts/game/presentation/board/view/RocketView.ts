import { IInitializable } from "../../../../core/lifecycle/IInitializable";
import { assertNotNull } from "../../../../core/utils/assert";
import { RocketAssets } from "../../common/assets/RocketAssets";
import { BaseView } from "../../common/view/BaseView";
import { RocketMotion } from "../../fx/RocketMotion";
import { RocketDirection } from "../../fx/RocketType";

const { ccclass, property } = cc._decorator;

@ccclass
export class RocketView extends BaseView implements IInitializable<RocketAssets> {
    @property(cc.Sprite)
    private mainSprite: cc.Sprite = null!;

    @property(RocketMotion)
    public rocket: RocketMotion = null!

    private _rockets!: RocketAssets;

    public validate(): void {
        super.validate();
        assertNotNull(this.mainSprite, this, "Sprite");
        assertNotNull(this.rocket, this, "RocketMotion");
    }

    public init(rockets: RocketAssets): void {
        this._rockets = rockets;
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public set(direction: RocketDirection): void {
        this.mainSprite.spriteFrame = this._rockets.getSprite(direction);
    }
}