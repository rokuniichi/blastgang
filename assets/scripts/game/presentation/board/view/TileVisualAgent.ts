import { EventBus } from "../../../../core/events/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { getLocal, getSpeed } from "../../utils/calc";
import { TileViewClicked } from "../events/TileViewClicked";
import { VisualTileDestroyed } from "../events/TileViewDestroyed";
import { VisualTileStabilized } from "../events/VisualTileStabilized";
import { TileView } from "./TileView";

export class TileVisualAgent {

    private readonly _visualConfig: VisualConfig;
    private readonly _eventBus: EventBus;
    private readonly _tweenHelper: TweenHelper;
    private readonly _boardCols: number;
    private readonly _boardRows: number;
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
        visualConfig: VisualConfig,
        eventBus: EventBus,
        tweenHelper: TweenHelper,
        tileId: string,
        view: TileView,
        boardCols: number,
        boardRows: number,
        backgroundLayer: cc.Node,
        tileLayer: cc.Node,
        fxLayer: cc.Node
    ) {
        this._visualConfig = visualConfig;
        this._eventBus = eventBus;
        this._tweenHelper = tweenHelper;

        this._id = tileId;
        this._view = view;

        this._boardCols = boardCols;
        this._boardRows = boardRows;
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

    public spawnInverted(type: TileType, at: TilePosition): void {
        this._position = { x: at.x, y: -at.y - this._visualConfig.initialSpawnLine };
        const source = getLocal(
            this._position,
            this._boardCols,
            this._boardRows,
            this._visualConfig.nodeWidth,
            this._visualConfig.nodeHeight
        );

        this.spawn(type, at, source, 0);
    }

    public spawnNormal(type: TileType, at: TilePosition, offset: number): void {
        this._position = { x: at.x, y: at.y - offset - this._visualConfig.normalSpawnLine };

        const source = getLocal(
            this._position,
            this._boardCols,
            this._boardRows,
            this._visualConfig.nodeWidth,
            this._visualConfig.nodeHeight
        );

        this.spawn(type, at, source, this.getDropDelay());
    }

    private spawn(type: TileType, at: TilePosition, source: cc.Vec2, delay: number) {
        console.log(`[SPAWN] ${BoardKey.type(type)} at ${BoardKey.position(at)} with offset ${source}`);
        const target = this.local(at);

        this.prepare(type, source);
        this.subscribe();

        this._tween = this._tweenHelper
            .build(TweenSettings.drop(this._view.node, source.y, target.y, this._visualConfig.gravity, delay))
            .call(() => {
                this.clear();
                this._position = at;
                this._target = null;
                this._eventBus.emit(new VisualTileStabilized(this._id, this._position));
                console.log(`[AGENT] ${this.id} SPAWN FINISHED!`);
            })
            .start();
    }


    public drop(to: TilePosition): void {
        if (this._position === to) return;

        if (this.busy) {
            this.clear();
            this._view.node.setParent(this._fxLayer);
            this._view.stabilize();
        }

        this.view.node.setParent(this._fxLayer);

        console.log(`[AGENT] ${this.id} is startng to move`);
        this._target = to;
        const targetY = this.local(this._target).y;

        this._tween = this._tweenHelper
            .build(TweenSettings.drop(this._view.node, this._view.node.y, targetY, this._visualConfig.gravity, this.getDropDelay()))
            .call(() => {
                this.clear();
                this._position = to;
                this._target = null;
                this.view.node.setParent(this._tileLayer);
                this._eventBus.emit(new VisualTileStabilized(this._id, this._position));
                console.log(`[AGENT] ${this.id} MOVE FINISHED!`);
            })
            .start();
    }

    public destroy(): void {
        this._view.node.setParent(this._backgroundLayer);
        this._tween = this._tweenHelper
            .build(TweenSettings.destroy(this._view.node))
            .call(() => {
                this.clear();
                this.hide();
                this.unsubscribe();
                this._eventBus.emit(new VisualTileDestroyed(this._id));
            })
            .start();
    }

    public shake(): void {
        this._view.node.setParent(this._fxLayer);
        this._tween = this._tweenHelper
            .build(TweenSettings.shake(this._view.node))
            .call(() => {
                this.clear();
                this._eventBus.emit(new VisualTileStabilized(this._id, this._position!));
            })
            .start();
    }

    private prepare(type: TileType, local: cc.Vec2): void {
        this._view.set(type);
        this._view.stabilize();
        this._view.node.setParent(this._tileLayer);
        this._view.node.setPosition(local);
        this._view.show();
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

    private onClick(): void {
        if (!this.busy && this._position) this._eventBus.emit(new TileViewClicked(this._position));
    }

    private subscribe() {
        this._view.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private unsubscribe() {
        this._view.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private getDropDelay() {
        return (this._boardRows - this._position!.y) * this._visualConfig.dropDelayParameter;
    }

    private local(position: TilePosition): cc.Vec2 {
        return getLocal(position, this._boardCols, this._boardRows, this._nodeWidth, this._nodeHeight);
    }
}
