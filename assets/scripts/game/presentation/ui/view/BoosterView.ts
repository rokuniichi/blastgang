import { assert, assertNotNull } from "../../../../core/utils/assert";
import { BoosterUsed } from "../../../domain/state/events/BoosterUsed";
import { BoosterType } from "../../../domain/state/models/BoosterType";
import { BoosterAssets } from "../../common/assets/BoosterAssets";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { PresentationViewContextFactory } from "../../common/view/PresentationView";
import { PresentationGraph } from "../../PresentationGraph";
import { BoosterViewContext } from "../context/BoosterViewContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoosterView extends DynamicTextView<BoosterViewContext> {
    @property(cc.Sprite)
    private targetSprite: cc.Sprite = null!;

    @property(BoosterAssets)
    private assets: BoosterAssets = null!

    @property({ type: cc.Enum(BoosterType) })
    private type: BoosterType = BoosterType.NONE;

    public contextFactory(): PresentationViewContextFactory<BoosterViewContext> {
        return (presentation: PresentationGraph) => new BoosterViewContext(presentation, this.type);
    }

    public validate(): void {
        assertNotNull(this.targetSprite, this, "target");
        assertNotNull(this.assets, this, "assets");
        assert(this.type !== BoosterType.NONE, this, "booster type can't be NONE");
    }

    protected onLoad(): void {
        super.onLoad();
        const sprite = this.assets.getSprite(this.type);
        assertNotNull(sprite, this, "sprite");
        this.targetSprite.spriteFrame = sprite;
    }

    protected eventType() {
        return BoosterUsed;
    }

    protected accept(event: BoosterUsed): boolean {
        return event.type === this.type;
    }

    protected format(value: number): string {
        return value.toString();
    }
}