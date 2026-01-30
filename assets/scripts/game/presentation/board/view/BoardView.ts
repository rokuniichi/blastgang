import { BoardChangedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { TileClickRejectedEvent, TileClickRejectedReason } from "../../../domain/board/events/TileClickRejectedEvent";
import { TileChange } from "../../../domain/board/models/TileChange";
import { TileMove } from "../../../domain/board/models/TileMove";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileSpawn } from "../../../domain/board/models/TileSpawn";
import { TileType } from "../../../domain/board/models/TileType";
import { TileAssets } from "../../core/assets/TileAssets";
import { EventView } from "../../core/view/EventView";
import { BoardAnimationHelper } from "../animations/BoardAnimationHelper";
import { BoardAnimationTracker } from "../animations/BoardAnimationTracker";
import { BoardViewContext } from "../context/BoardViewContext";
import { BoardSyncedEvent } from "../events/BoardSyncedEvent";
import { BoardMap } from "./BoardMap";
import { TileView } from "./TileView";


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

    private _boardMap!: BoardMap;

    private _animationTracker!: BoardAnimationTracker;
    private _animationHelper!: BoardAnimationHelper;

    protected onInit(): void {
        this._boardMap = new BoardMap();
        this._animationTracker = new BoardAnimationTracker(this.context.boardRuntime);
        this._animationHelper = new BoardAnimationHelper(this.context.animationSystem, this._animationTracker, this.backgroundLayer, this.fxLayer, this.tileAssets);

        this.drawBoard(this.context.initialBoard);
        this.on(BoardChangedEvent, this.onBoardChanged);
        this.on(TileClickRejectedEvent, this.onTileClickRejected)
    }

    private onBoardChanged = async (event: BoardChangedEvent) => {
        this.animate(event);
        this.syncBoard(event.changes);
        this.sortTiles();
    };

    private onTileClickRejected = async (event: TileClickRejectedEvent) => {
        console.log(`Tile rejected for reason: ${event.reason.toString()}`);
        if (event.reason == TileClickRejectedReason.NO_CLUSTER) {
            this.animateShake(event.position);
        }
    }

    private sortTiles(): void {
        const tiles = this._boardMap.views();

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
            let view = this._boardMap.get(change.position);
            if (change.after === TileType.NONE) {
                if (view) {
                    // MEMO
                    view.hide();
                }
                continue;
            }
            if (!view) {
                view = this.createTile(change.position);
                this._boardMap.set(change.position, view);
            }
            view.set(this.tileAssets.get(change.after));
            const pos = this.getLocalPosition(change.position, view.node);
            view.node.setPosition(pos);
        }
    }

    private animate(event: BoardChangedEvent) {
        this.animateDestroy(event.destroyed);
        this.animateDrop(event.dropped);
        this.animateSpawn(event.spawned);
    }

    private animateDestroy(data: TilePosition[]) {
        for (const pos of data) {
            const view = this._boardMap.get(pos);
            if (!view) continue;
            this._animationHelper.destroy(view);
        }
    }

    private animateDrop(data: TileMove[]) {
        for (const move of data) {
            const view = this._boardMap.get(move.from);
            if (!view) continue;
            const target = this.getLocalPosition(move.to, view.node);
            this._animationHelper.drop(view, target);
        }
    }

    private animateSpawn(data: TileSpawn[]) {
        for (const spawn of data) {
            const view = this._boardMap.get(spawn.at);
            if (!view) continue;

            const to = this.getLocalPosition(spawn.at, view.node);
            const from = to.clone();
            from.y += view.node.height * 2;
            this._animationHelper.spawn(view, from, to, spawn.type);
        }
    }

    private animateShake(data: TilePosition) {
        const view = this._boardMap.get(data);
        if (!view) return;
        this._animationHelper.shake(view);
    }

    private getLocalPosition(pos: TilePosition, node: cc.Node): cc.Vec3 {
        const originX = -((this.context.boardWidth - 1) * node.width) / 2;
        const originY = ((this.context.boardHeight - 1) * node.height) / 2;

        return cc.v3(
            originX + pos.x * node.width,
            originY - pos.y * node.height,
            0
        );
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