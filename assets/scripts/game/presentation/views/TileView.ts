import { EventView } from "./EventView";
import { TileViewContext } from "../context/TileViewContext";
import { TileClickedEvent } from "../events/TileClickedEvent";
import { assertNotNull } from "../../../core/utils/assert";
import { TilePosition } from "../../domain/models/TilePosition";

const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends EventView<TileViewContext> {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null!;

    private position!: TilePosition;

    public override validate(): void {
        assertNotNull(this.sprite, this, "sprite");
    }

    protected override onInit(): void {
        this.position = this.context.position;
    }

    protected override subscribe(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    protected override unsubscribe(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick(): void {
        this.emit(new TileClickedEvent(this.position));
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public set(spriteFrame: cc.SpriteFrame): void {
        this.sprite.spriteFrame = spriteFrame;
    }

    public destroyWithAnimation(): void {

        const visual = this.sprite.node;

        visual.stopAllActions();

        const duration: number = 0.15;
        const randomAngle: number = (Math.random() - 0.5) * 60;
        const randomOffsetX: number = (Math.random() - 0.5) * 20;
        const randomOffsetY: number = (Math.random() - 0.5) * 20;

        const scaleUp = cc.scaleTo(duration, 1.2);
        const scaleDown = cc.scaleTo(duration, 0.0);
        const fadeOut = cc.fadeOut(duration);
        const rotate = cc.rotateBy(duration * 2, randomAngle);
        const move = cc.moveBy(duration * 2, randomOffsetX, randomOffsetY);

        const spawn = cc.spawn(scaleDown, fadeOut, rotate, move);

        const sequence = cc.sequence(
            scaleUp,
            spawn,
            cc.callFunc((): void => {
                this.hide();
                visual.opacity = 255;
                visual.scale = 1;
                visual.angle = 0;
                visual.setPosition(0, 0);
            })
        );

        visual.runAction(sequence);
    }
}