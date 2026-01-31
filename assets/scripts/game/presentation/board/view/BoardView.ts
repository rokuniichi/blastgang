import { BoardProcessResult } from "../../../domain/board/events/BoardProcessResult";
import { TileClickRejectedEvent, TileClickRejectedReason } from "../../../domain/board/events/TileClickRejection";
import { TileChange } from "../../../domain/board/models/TileChange";
import { TileMove } from "../../../domain/board/models/TileMove";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileSpawn } from "../../../domain/board/models/TileSpawn";
import { TileType } from "../../../domain/board/models/TileType";
import { TileAssets } from "../../common/assets/TileAssets";
import { EventView } from "../../common/view/EventView";
import { BoardAnimationHelper } from "../animations/BoardAnimationHelper";
import { BoardAnimationTracker } from "../animations/BoardAnimationTracker";
import { BoardViewContext } from "../context/BoardViewContext";
import { BoardSyncedEvent } from "../events/BoardSyncedEvent";
import { TileView } from "./TileView";
import { VisualBoardModel } from "./VisualBoardModel";


const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends EventView<BoardViewContext> {

    @property(cc.Prefab)
    private tilePrefab: cc.Prefab = null!;

    @property(cc.Node)
    private backgroundLayer: cc.Node = null!

    @property(cc.Node)
    private tileLayer: cc.Node = null!;

    @property(cc.Node)
    private fxLayer: cc.Node = null!;

    @property(TileAssets)
    private tileAssets: TileAssets = null!;

    private _visualModel!: VisualBoardModel;

    private _animationTracker!: BoardAnimationTracker;
    private _animationHelper!: BoardAnimationHelper;

    protected onInit(): void {
        this._visualModel = new VisualBoardModel();
        this._animationTracker = new BoardAnimationTracker(this.context.boardRuntime);
        this._animationHelper = new BoardAnimationHelper(
            this.context.animationSystem,
            this._animationTracker,
            this.backgroundLayer,
            this.fxLayer,
            this.tilePrefab,
            this.tileAssets,
            this.context.boardWidth,
            this.context.boardHeight
        );


        this.drawBoard(this.context.initialBoard);
        this.on(BoardProcessResult, this.onBoardChanged);
        this.on(TileClickRejectedEvent, this.onTileClickRejected)
    }

    private onBoardChanged = async (event: BoardProcessResult) => {
        this.animate(event);
        this.sortTiles();
        this.syncBoard(event.changes);
    };

    private onTileClickRejected = async (event: TileClickRejectedEvent) => {
        if (event.reason == TileClickRejectedReason.NO_CLUSTER) {
            this.animateShake(event.position);
        }
    }

    private sortTiles(): void {
        const tiles = this._visualModel.views();

        tiles.sort((a, b) => a.position.y - b.position.y)

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].node.setSiblingIndex(i);
        }
    }

    private syncBoard(changes: TileChange[]) {
        this.drawBoard(changes);
        this.emit(new BoardSyncedEvent());
    }

    private drawBoard(changes: TileChange[]): void {
        for (const change of changes) {
            let view = this._visualModel.get(change.position);
            if (change.after === TileType.NONE) {
                if (view) {
                    // MEMO условно как то переделать
                    view.hide();
                }
                continue;
            }
            if (!view) {
                view = this.createTile(change.position);
                this._visualModel.set(change.position, view);
            }
            view.set(this.tileAssets.get(change.after));
            const position = this._animationHelper.getLocalPosition(change.position, view.node.width, view.node.height);
            view.node.setPosition(position);
        }
    }

    private animate(event: BoardProcessResult) {
        this.animateDestroy(event.instructions.destroyed);
        this.animateDrop(event.instructions.dropped);
        this.animateSpawn(event.instructions.spawned);
    }

    private animateDestroy(data: TilePosition[]) {
        for (const position of data) {
            const view = this._visualModel.get(position);
            if (!view) continue;
            this._animationHelper.destroy(view, position);
        }
    }

    private animateDrop(data: TileMove[]) {
        for (const move of data) {
            const view = this._visualModel.get(move.from);
            if (!view) continue;
            this._animationHelper.drop(view, move.to);
        }
    }

    private animateSpawn(data: TileSpawn[]) {
        for (const spawn of data) {
            const view = this._visualModel.get(spawn.at);
            if (!view) continue;
            this._animationHelper.spawn(view, spawn.at, spawn.type);
        }
    }

    private animateShake(data: TilePosition) {
        const view = this._visualModel.get(data);
        if (!view) return;
        this._animationHelper.shake(view);
    }

    private createTile(position: TilePosition): TileView {
        const node = cc.instantiate(this.tilePrefab);
        node.setParent(this.tileLayer);

        const view = node.getComponent(TileView)!;
        view.init({
            eventBus: this.eventBus,
            position
        });

        return view;
    }
}