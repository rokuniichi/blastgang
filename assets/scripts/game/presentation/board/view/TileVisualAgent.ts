import { EventBus } from "../../../../core/eventbus/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { DestroyCause } from "../../../domain/board/events/mutations/DestroyMutation";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { TweenSettings } from "../../common/animations/TweenSettings";
import { IClickable } from "../../common/view/IClickable";
import { RocketDirection } from "../../fx/RocketType";
import { getLocal } from "../../utils/calc";
import { VisualTileClicked } from "../events/VisualTileClicked";
import { VisualTileDestroyed } from "../events/VisualTileDestroyed";
import { VisualTileFlown } from "../events/VisualTileFlown";
import { VisualTileLanded } from "../events/VisualTileLanded";
import { VisualTileShaken } from "../events/VisualTileShaken";
import { VisualTileSwapped } from "../events/VisualTileSwapped";
import { VisualTileTransformed } from "../events/VisualTileTransformed";
import { RocketFxHolder } from "./RocketFxHolder";
import { TileDestructionFxHolder } from "./TileDestructionFxHolder";
import { TileFlashFxHolder } from "./TileFlashFxHolder";
import { TileView } from "./TileView";

export class TileVisualAgent implements IClickable {

    private readonly _visualConfig: VisualConfig;
    private readonly _eventBus: EventBus;
    private readonly _tweenSystem: TweenSystem;
    private readonly _boardCols: number;
    private readonly _boardRows: number;
    private readonly _nodeWidth: number;
    private readonly _nodeHeight: number;

    private readonly _tilesLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private readonly _destructionFx: TileDestructionFxHolder;
    private readonly _rocketFx: RocketFxHolder;
    private readonly _flashFx: TileFlashFxHolder;

    private readonly _id: TileId;
    private readonly _view: TileView;

    private _type: TileType;
    private _position!: TilePosition;

    public constructor(
        visualConfig: VisualConfig,
        eventBus: EventBus,
        tweenSystem: TweenSystem,
        tileId: string,
        view: TileView,
        type: TileType,
        boardCols: number,
        boardRows: number,
        tilesLayer: cc.Node,
        fxLayer: cc.Node,
        destructionFx: TileDestructionFxHolder,
        rocketFx: RocketFxHolder,
        flashFx: TileFlashFxHolder
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

        this._tilesLayer = tilesLayer;
        this._fxLayer = fxLayer;

        this._destructionFx = destructionFx;
        this._rocketFx = rocketFx;
        this._flashFx = flashFx;
    }

    public get id(): string {
        return this._id;
    }

    public get position(): TilePosition {
        return this._position;
    }

    public get busy(): boolean {
        return this._view.drop.running || this._view.sling.running;
    }

    public spawn(type: TileType, from: TilePosition, to: TilePosition, delay: number) {
        this._position = from;

        const source = this.local(from);
        const target = this.local(to);

        this.prepare(source, to);
        this.subscribe();
        this._view.drop.onDropped(() => this.landed(to));
        this._view.drop.play(source.y, target.y, delay, this._visualConfig.drop);
    }

    public drop(to: TilePosition, delay: number): void {
        const source = this._view.node.position;
        const target = this.local(to);
        this._view.drop.onDropped(() => this.landed(to));
        this._view.drop.play(
            source.y,
            target.y,
            delay,
            this._visualConfig.drop
        );
    }

    public swap(to: TilePosition): void {
        this.sling(to, (to) => this.swapped(to));
    }

    public fly(to: TilePosition): void {
        this.highlight(true);
        this.sling(to, (_) => this.flown());
    }

    public sling(to: TilePosition, callback: (to: TilePosition) => void): void {
        const source = cc.v2(this._view.node.position);
        const target = this.local(to);
        this._view.sling.onSlinged(() => callback(to));
        this._view.sling.play(source, target, this._visualConfig.sling);
    }

    public destroy(): void {
        const local = this._view.node.position;
        this._destructionFx.play(local, this._type);
        this._flashFx.play(local);
        this.destroyed();
    }

    public shake(): void {
        this._tweenSystem
            .build(TweenSettings.shake(this._view.node))
            .call(() => {
                this._eventBus.emit(new VisualTileShaken(this._id));
            })
            .start();
    }

    public transform(type: TileType) {
        this._type = type;
        this._view.set(type);

        this._tweenSystem
            .build(TweenSettings.pulse(this._view.node))
            .call(() => {
                this._eventBus.emit(new VisualTileTransformed(this._id));
            })
            .start();
    }

    public launch(cause: DestroyCause) {
        switch (cause) {
            case "horizontal_rocket": {
                this._rocketFx.play(this.position, RocketDirection.LEFT);
                this._rocketFx.play(this.position, RocketDirection.RIGHT);
                break;
            }

            case "vertical_rocket": {
                this._rocketFx.play(this.position, RocketDirection.UP);
                this._rocketFx.play(this.position, RocketDirection.DOWN);
                break;
            }

            default:
                break;
        }

        this.destroyed();
    }

    public highlight(state: boolean): void {
        this._view.highlight(state);
        this._view.node.setParent(state ? this._fxLayer : this._tilesLayer);
    }

    public onClick(): void {
        if (!this.busy) this._eventBus.emit(new VisualTileClicked(this.id));
    };

    private prepare(local: cc.Vec2, position: TilePosition): void {
        this._view.stabilize();
        this._view.node.setPosition(local);
        this._view.node.setSiblingIndex(position.y * this._boardCols + position.x)
        this._view.show();
    }

    private hide() {
        this._view.hide();
    }

    private subscribe() {
        this._view.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private unsubscribe() {
        this._view.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    private landed(to: TilePosition) {
        this._position = to;
        this._eventBus.emit(new VisualTileLanded(this._id, to));
    }

    private swapped(to: TilePosition) {
        this._position = to;
        this.highlight(false);
        this._eventBus.emit(new VisualTileSwapped(this._id));
    }

    private flown() {
        this.destroyed();
        this._eventBus.emit(new VisualTileFlown(this._id));
    }

    private destroyed() {
        this.highlight(false);
        this.hide();
        this.unsubscribe();
        this._eventBus.emit(new VisualTileDestroyed(this._id));
    }


    private local(position: TilePosition): cc.Vec2 {
        return getLocal(position, this._boardCols, this._boardRows, this._nodeWidth, this._nodeHeight);
    }
}
