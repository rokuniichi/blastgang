import { EventBus } from "../../../../core/events/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { VisualConfig } from "../../../application/common/config/visual/VisualConfig";
import { TileId } from "../../../domain/board/models/BoardLogicalModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { VisualTileClicked } from "../events/VisualTileClicked";
import { VisualTileUnlocked } from "../events/VisualTileUnlocked";
import { TileView } from "./TileView";

export class TileVisualAgent {

    private readonly _visualConfig: VisualConfig;
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

    private _lock: TileLockReason;

    constructor(
        visualConfig: VisualConfig,
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
        this._visualConfig = visualConfig;
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

        this._lock = TileLockReason.NONE;
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

    public spawn(type: TileType, at: TilePosition, offset: number): void {
        this.relock(TileLockReason.SPAWN);

        console.log(`[SPAWN] ${BoardKey.type(type)} at ${BoardKey.position(at)} with offset ${offset}`);
        const target = this.getLocal(at);
        const source = this.getLocal({ x: at.x, y: at.y - offset });

        this.prepare(type, source);
        this.subscribe();

        this._tween = this._tweenHelper
            .build(TweenSettings.tileDrop(this._view.node, source.y + this._visualConfig.spawnLineY, target.y, this.getSpeed()))
            .call(() => {
                this.clear();
                this._position = at;
                this._target = null;
                console.log(`[AGENT] ${this.id} SPAWN FINISHED!`);
                this.unlock();
            })
            .start();
    }

    public move(to: TilePosition): void {
        this.relock(TileLockReason.DROP);

        if (this._position === to) return;

        if (this.busy) {
            this.clear();
            this.stabilize();
        }

        this.view.node.setParent(this._fxLayer);

        console.log(`[AGENT] ${this.id} is startng to move`);
        this._target = to;
        const targetY = this.getLocal(this._target).y;

        this._tween = this._tweenHelper
            .build(TweenSettings.tileDrop(this._view.node, this._view.node.y, targetY, this.getSpeed()))
            .call(() => {
                this.clear();
                this._position = to;
                this._target = null;
                this.view.node.setParent(this._tileLayer);
                console.log(`[AGENT] ${this.id} MOVE FINISHED!`);
                this.unlock();
            })
            .start();
    }

    public destroy(): void {
        this.relock(TileLockReason.DESTROY);

        this._view.node.setParent(this._backgroundLayer);
        this._tween = this._tweenHelper
            .build(TweenSettings.tileDestroy(this._view.node))
            .call(() => {
                this.clear();
                this.hide();
                this.unsubscribe();
                this.unlock();
            })
            .start();
    }

    public shake(): void {
        this.relock(TileLockReason.SHAKE);
        this._view.node.setParent(this._fxLayer);
        this._tween = this._tweenHelper
            .build(TweenSettings.tileShake(this._view.node))
            .call(() => {
                this.clear();
                this.relock(TileLockReason.NONE);
            })
            .start();
    }

    private onClick(): void {
        console.log(`[AGENT] ${this.id} CLICKED`);
        if (!this.busy && this._position) this._eventBus.emit(new VisualTileClicked(this._position));
    }

    private subscribe() {
        this._view.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private unsubscribe() {
        this._view.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private prepare(type: TileType, local: cc.Vec2): void {
        this._view.set(type);
        this._view.stabilize();
        this._view.node.setParent(this._tileLayer);
        this._view.node.setPosition(local);
        this._view.show();
    }

    private stabilize(): void {
        this._view.node.setParent(this._fxLayer);
        this._view.stabilize();
    }

    private clear() {
        if (this._tween) {
            this._tween.stop();
        }

        this._tween = null;
    }

    private hide() {
        this.view.hide();
    }

    private unlock() {
        this.relock(TileLockReason.NONE);
    }

    private relock(reason: TileLockReason) {
        this._eventBus.emit(new VisualTileUnlocked(this._id, this._lock));
        this._lock = reason;
    }

    private getLocal(position: TilePosition): cc.Vec2 {
        const origin = this.getOrigin();
        return cc.v2(origin.x + position.x * this._nodeWidth, origin.y - position.y * this._nodeHeight);
    }

    private getOrigin(): cc.Vec2 {
        const originX = -((this._boardWidth - 1) * this._nodeWidth) / 2;
        const originY = ((this._boardHeight - 1) * this._nodeHeight) / 2;
        return cc.v2(originX, originY);
    }

    private getSpeed(): number {
        return this._view.node.height * this._visualConfig.cellsPerSecond;
    }
}
