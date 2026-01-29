import { BoardChangedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { TileChange } from "../../../domain/board/models/TileChange";
import { TileMove } from "../../../domain/board/models/TileMove";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileSpawn } from "../../../domain/board/models/TileSpawn";
import { TileType } from "../../../domain/board/models/TileType";
import { TileAssets } from "../../core/assets/TileAssets";
import { BoardSyncedEvent } from "../../core/events/BoardSyncedEvent";
import { EventView } from "../../core/view/EventView";
import { BoardViewContext } from "../context/BoardViewContext";
import { BoardFxLayer } from "../fx/BoardFxLayer";
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

    private boardMap!: BoardMap;
    private fx!: BoardFxLayer;

    protected onInit(): void {
        this.boardMap = new BoardMap(this.context.boardWidth, this.context.boardHeight);

        this.fx = new BoardFxLayer(this.context.animationSystem, this.backgroundLayer, this.fxLayer, this.tileAssets);

        this.drawBoard(this.context.initialBoard);
        this.on(BoardChangedEvent, this.onBoardChanged);
    }

    private onBoardChanged = async (event: BoardChangedEvent) => {
        await this.animate(event);
        this.syncBoard(event.changes);
    };

    private syncBoard(changes: TileChange[]) {
        this.drawBoard(changes);
        this.emit(new BoardSyncedEvent());
    }

    private drawBoard(changes: TileChange[]): void {
        for (const change of changes) {
            let view = this.boardMap.get(change.position);

            if (change.after === TileType.NONE) {
                if (view) {
                    view.node.destroy();
                    this.boardMap.delete(change.position);
                }
                continue;
            }

            if (!view) {
                view = this.createTile(change.position);
                this.boardMap.set(change.position, view);
            }

            view.set(this.tileAssets.get(change.after));

            const pos = this.getLocalPosition(change.position, view.node);
            view.node.setPosition(pos);
            view.show();
        }
    }

    private async animate(event: BoardChangedEvent) {
        await Promise.all([
            this.animateDestroy(event.destroyed),
            this.animateDrop(event.dropped),
            this.animateSpawn(event.spawned)
        ]);

    }

    private async animateDestroy(data: TilePosition[]) {
        const tasks: Promise<void>[] = [];

        for (const pos of data) {
            const view = this.boardMap.get(pos);
            if (!view) continue;
            view.hide();
            tasks.push(this.fx.destroy(view));
        }

        await Promise.all(tasks);
    }

    private async animateDrop(data: TileMove[]) {
        const tasks: Promise<void>[] = [];

        for (const move of data) {
            const view = this.boardMap.get(move.from);
            if (!view) continue;
            view.hide();
            const targetWorld = this.getLocalPosition(move.to, view.node);
            tasks.push(this.fx.drop(view, targetWorld));
        }

        await Promise.all(tasks);
    }

    private async animateSpawn(data: TileSpawn[]) {
        const tasks: Promise<void>[] = [];

        for (const spawn of data) {
            const view = this.boardMap.get(spawn.at);
            if (!view) continue;

            const to = this.getLocalPosition(spawn.at, view.node);
            const from = to.clone();
            from.y += view.node.height * 2;

            tasks.push(this.fx.spawn(view, from, to, spawn.type));
        }

        await Promise.all(tasks);
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