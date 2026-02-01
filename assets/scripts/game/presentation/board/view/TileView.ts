import { assertNotNull } from "../../../../core/utils/assert";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileClickedCommand } from "../events/TileClickedCommand";
import { EventView } from "../../common/view/EventView";
import { TileViewContext } from "../context/TileViewContext";
import { TileAssets } from "../../common/assets/TileAssets";
import { TileType } from "../../../domain/board/models/TileType";


const { ccclass, property } = cc._decorator;

@ccclass
export class TileView extends EventView<TileViewContext> {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null!;

    @property(TileAssets)
    private tileAssets: TileAssets = null!;

    public position!: TilePosition;

    private _type!: TileType;

    public validate(): void {
        super.validate();
        assertNotNull(this.sprite, this, "Sprite");
    }

    protected preInit(): void {
        super.preInit();
        assertNotNull(this.context.position, this, "boardModel");
    }

    protected onInit(): void {
        this.position = this.context.position;
    }

    protected postInit(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    protected onDispose(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick(): void {
        this.emit(new TileClickedCommand(this.position));
    }

    public show(): void {
        this.node.active = true;
        this.sprite.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
        this.sprite.node.active = false;
    }

    public set(type: TileType): void {
        this._type = type;
        const spriteFrame = this.tileAssets.get(type);
        this.sprite.spriteFrame = spriteFrame;
    }

    public get(): TileType {
        return this._type;
    }
}