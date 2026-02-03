import { EventBus } from "../../../../core/events/EventBus";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenSettings } from "../../common/animations/settings/TweenSettings";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { VisualTileClicked } from "../events/VisualTileClicked";
import { VisualTileDestroyed } from "../events/VisualTileDestroyed";
import { VisualTileSpawned } from "../events/VisualTileSpawned";
import { TileView } from "./TileView";

export class TileVisualAgent {

    private readonly _eventBus: EventBus;
    private readonly _tweenHelper: TweenHelper;
    private readonly _boardWidth: number;
    private readonly _boardHeight: number;
    private readonly _nodeWidth: number;
    private readonly _nodeHeight: number;
    private readonly _backgroundLayer: cc.Node;
    private readonly _tileLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private readonly _id: TileId;
    private readonly _view: TileView;

    private _type: TileType | null = null;
    private _position: TilePosition | null = null;
    private _target: TilePosition | null = null;
    private _tween: cc.Tween | null = null;

    constructor(
        eventBus: EventBus,
        tweenHelper: TweenHelper,
        tileId: string,
        view: TileView,
        boardWidth: number,
        boardHeight: number,
        backgroundLayer: cc.Node,
        tileLayer: cc.Node,
        fxLayer: cc.Node
    ) {
        this._eventBus = eventBus;

        this._tweenHelper = tweenHelper;

        this._id = tileId;
        this._view = view;

        this._boardWidth = boardWidth;
        this._boardHeight = boardHeight;
        this._nodeWidth = view.node.width;
        this._nodeHeight = view.node.height;
        this._backgroundLayer = backgroundLayer;
        this._tileLayer = tileLayer;
        this._fxLayer = fxLayer;
    }

    public get id(): string {
        return this._id;
    }

    public get view(): TileView {
        return this._view;
    }

    public get type(): TileType | null {
        return this._type ?? null;
    }

    public get position(): TilePosition | null {
        return this._position ?? null;
    }

    public get target(): TilePosition | null {
        return this._target ?? null;
    }

    public get busy(): boolean {
        return this._tween !== null;
    }

    public spawn(type: TileType, at: TilePosition): void {

        this._position = at;
        this._view.set(type);
        this._view.node.setPosition(this.getLocal(this._position));
        this._view.node.active = true;
        this._view.node.setParent(this._tileLayer);

        this._view.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);

        this._eventBus.emit(new VisualTileSpawned(this._id));
    }

    public move(to: TilePosition): void {

        // TODO tween move
        this._position = to;
        this._view.node.setPosition(this.getLocal(to));
        /* if (!this.busy) {
            this.startMove(to);
        } else {
            this.retargetMove(to);
        } */
    }

    public destroy(): void {
        this._view.node.setParent(this._fxLayer);
        this._tween = this._tweenHelper
            .build(TweenSettings.tileDestroy(this._view.node))
            .call(() => {
                this._tween = null;
                this._eventBus.emit(new VisualTileDestroyed(this._id));
                this._view.hide();
                this._view.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
            })
            .start();
    }

    public shake(): void {
        this._view.node.setParent(this._fxLayer);
        this._tween = this._tweenHelper
            .build(TweenSettings.tileShake(this._view.node))
            .call(() => {
                this._tween = null;
            })
            .start();
    }

    private onClick(): void {
        if (this._position) this._eventBus.emit(new VisualTileClicked(this._position));
    }

    // ===== PRIVATE =====

    private retarget(to: TilePosition): void {
        this.clear();
        //this.startMove(to);
    }

    /*  private startMove(to: TilePosition) {
           this.busy = true;
           this.currentTarget = to;
   
           const worldPos = BoardCoords.toWorld(to);
   
           this.currentTween = cc.tween(this._node)
               .to(0.25, { position: worldPos })
               .call(() => {
                   this.busy = false;
                   this.currentTween = undefined;
               })
               .start();
       } */

    private clear() {
        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }
    }

    private playDestroyFx() {
        // fx / particles / shake / etc
    }

    private getLocal(position: TilePosition): cc.Vec2 {
        const originX = -((this._boardWidth - 1) * this._nodeWidth) / 2;
        const originY = ((this._boardHeight - 1) * this._nodeHeight) / 2;

        return cc.v2(originX + position.x * this._nodeWidth, originY - position.y * this._nodeHeight);
    }
}
