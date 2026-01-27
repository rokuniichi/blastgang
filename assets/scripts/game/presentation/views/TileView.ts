const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite | null = null;

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public setSprite(spriteFrame: cc.SpriteFrame): void {
        this.sprite!.spriteFrame = spriteFrame;
    }

    public setPosition(x: number, y: number): void {
        this.node.setPosition(x, y);
    }
}