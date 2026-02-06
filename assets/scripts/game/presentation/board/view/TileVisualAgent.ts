import { EventBus } from "../../../../core/eventbus/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { getLocal } from "../../utils/calc";
import { TileViewClicked } from "../events/TileViewClicked";
import { VisualTileDestroyed } from "../events/TileViewDestroyed";
import { VisualTileStabilized } from "../events/VisualTileStabilized";
import { DropMotion } from "../fx/components/DropMotions";
import { TileDestructionFx } from "../fx/TileDestructionFx";
import { TileFlashFx } from "../fx/TileFlashFx";
import { TileView } from "./TileView";

export class TileVisualAgent {

    private readonly _visualConfig: VisualConfig;
    private readonly _eventBus: EventBus;
    private readonly _tweenSystem: TweenSystem;
    private readonly _boardCols: number;
    private readonly _boardRows: number;
    private readonly _nodeWidth: number;
    private readonly _nodeHeight: number;
    private readonly _parent: cc.Node;

    private readonly _destructionFx: TileDestructionFx;
    private readonly _flashFx: TileFlashFx;

    private readonly _id: TileId;
    private readonly _view: TileView;
    private readonly _type: TileType;

    private _position: TilePosition | null = null;
    private _target: TilePosition | null = null;

    constructor(
        visualConfig: VisualConfig,
        eventBus: EventBus,
        tweenSystem: TweenSystem,
        tileId: string,
        view: TileView,
        type: TileType,
        boardCols: number,
        boardRows: number,
        parent: cc.Node,
        destructionFx: TileDestructionFx,
        flashFx: TileFlashFx
    ) {
        this._visualConfig = visualConfig;
        this._eventBus = eventBus;
        this._tweenSystem = tweenSystem;

        this._id = tileId;
        this._view = view;
        this._type = type;

        this._boardCols = boardCols;
        this._boardRows = boardRows;
        this._nodeWidth = view.node.width;
        this._nodeHeight = view.node.height;
        this._parent = parent;

        this._destructionFx = destructionFx;
        this._flashFx = flashFx;
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
        const drop = this.view.getComponent(DropMotion);
        return drop.running;
    }

    public spawn(type: TileType, from: TilePosition, to: TilePosition, delay: number) {
        this._position = from;
        this._target = to;


        console.log(`[SPAWN] ${BoardKey.type(type)} at ${BoardKey.position(to)} with offset ${from}`);

        const source = this.local(from);
        const target = this.local(to);

        this.prepare(source);
        this.subscribe();

        const drop = this._view.getComponent(DropMotion);
        drop.onDropped(() => this.landed(to));
        drop.play(
            source.y,
            target.y,
            this._visualConfig.gravity,
            delay,
            this._visualConfig.drop.bounce,
            this._visualConfig.drop.bounceDuration,
            this._visualConfig.drop.settleDuration
        );
    }

    public drop(to: TilePosition, delay: number): void {
        if (this._position === to) return;
        this._target = to;

        const drop = this._view.getComponent(DropMotion);
        const source = drop.running ? this.view.node.position : this.local(this._position!);
        const target = this.local(this._target);
        drop.onDropped(() => this.landed(to));
        drop.play(
            source.y,
            target.y,
            this._visualConfig.gravity,
            delay,
            this._visualConfig.drop.bounce,
            this._visualConfig.drop.bounceDuration,
            this._visualConfig.drop.settleDuration
        );
        console.log(`[AGENT] ${this.id} is startng to move`);
    }

    public destroy(): void {
        const local = this._view.node.position;
        this._destructionFx.play(local, this._type);
        this._flashFx.play(local);
        this.hide();
        this.unsubscribe();
        this._eventBus.emit(new VisualTileDestroyed(this._id));
    }

    public shake(): void {
        this._view.node.setParent(this._parent);
        this._tweenSystem
            .build(TweenSettings.shake(this._view.node))
            .call(() => {
                this._eventBus.emit(new VisualTileStabilized(this._id, this._position!));
            })
            .start();
    }

    private prepare(local: cc.Vec2): void {
        this._view.stabilize();
        this._view.node.setParent(this._parent);
        this._view.node.setPosition(local);
        this._view.node.setSiblingIndex(this._target!.y * this._boardCols + this._target!.x)
        this._view.show();
    }

    private subscribe() {
        this._view.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private unsubscribe() {
        this._view.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private hide() {
        this.view.hide();
    }

    private landed(to: TilePosition) {
        console.log(`[LANDED] from: ${BoardKey.position(this._position!)} to: ${BoardKey.position(to)}`);
        this._position = to;
        this._eventBus.emit(new VisualTileStabilized(this._id, this._position));
    }

    private onClick(): void {
        if (!this.busy && this._position) this._eventBus.emit(new TileViewClicked(this._position));
    };

    private local(position: TilePosition): cc.Vec2 {
        return getLocal(position, this._boardCols, this._boardRows, this._nodeWidth, this._nodeHeight);
    }
}
