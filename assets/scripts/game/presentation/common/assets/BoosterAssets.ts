import { IValidatable } from "../../../../core/lifecycle/IValidatable";
import { assertNotNull } from "../../../../core/utils/assert";
import { ensureNotNull } from "../../../../core/utils/ensure";
import { BoosterType } from "../../../domain/state/models/BoosterType";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoosterAssets extends cc.Component implements IValidatable {

    @property(cc.SpriteFrame)
    private swap: cc.SpriteFrame = null!;

    @property(cc.SpriteFrame)
    private bomb: cc.SpriteFrame = null!;

    private _map!: Map<BoosterType, cc.SpriteFrame>;

    protected onLoad(): void {
        this.validate();
    }

    public validate(): void {
        this._map = new Map<BoosterType, cc.SpriteFrame>([
            [BoosterType.SWAP, ensureNotNull(this.swap, this, "SWAP")],
            [BoosterType.BOMB, ensureNotNull(this.bomb, this, "BOMB")],
        ]);
    }

    public getSprite(type: BoosterType): cc.SpriteFrame {
        const sprite = this._map.get(type);
        assertNotNull(sprite, this, `Sprite for type ${BoosterType[type]}`);
        return sprite;
    }
}