import { assert, assertNotNull } from "../../../../core/utils/assert";
import { BoosterSelected } from "../../../application/input/intents/BoosterSelected";
import { BoosterUsed } from "../../../domain/state/events/BoosterUsed";
import { BoosterType } from "../../../domain/state/models/BoosterType";
import { BoosterClicked } from "../../board/events/BoosterClicked";
import { BoosterAssets } from "../../common/assets/BoosterAssets";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { IClickable } from "../../common/view/IClickable";
import { IHighlightable } from "../../common/view/IHighlightable";
import { PresentationViewContextFactory } from "../../common/view/PresentationView";
import { PresentationGraph } from "../../PresentationGraph";
import { BoosterViewContext } from "../context/BoosterViewContext";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoosterView extends DynamicTextView<BoosterViewContext> implements IClickable, IHighlightable {
    @property(cc.Sprite)
    private targetSprite: cc.Sprite = null!;

    @property(cc.Node)
    private backgroundHighlight: cc.Node = null!;

    @property(BoosterAssets)
    private assets: BoosterAssets = null!

    @property({ type: cc.Enum(BoosterType) })
    private type: BoosterType = BoosterType.NONE;

    private _highlightState: boolean = false;

    public contextFactory(): PresentationViewContextFactory<BoosterViewContext> {
        return (presentation: PresentationGraph) => new BoosterViewContext(presentation, this.type);
    }

    protected onInit(): void {
        this.on(BoosterSelected, this.onBoosterSelected);
        this.highlight(false);
    }

    public validate(): void {
        assertNotNull(this.targetSprite, this, "target");
        assertNotNull(this.assets, this, "assets");
        assert(this.type !== BoosterType.NONE, this, "booster type can't be NONE");
    }

    private onBoosterSelected = (event: BoosterSelected): void => {
        this.highlight(event.type === this.type);
    };

    public onClick(): void {
        this.emit(new BoosterClicked(this.type));
    }

    public highlight(state: boolean): void {
        this.backgroundHighlight.active = state;
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