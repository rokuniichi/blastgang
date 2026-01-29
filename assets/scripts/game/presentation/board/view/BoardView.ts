import { BoardChangedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { TileChange } from "../../../domain/board/models/TileChange";
import { TileMove } from "../../../domain/board/models/TileMove";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileSpawn } from "../../../domain/board/models/TileSpawn";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSettings } from "../../core/animations/AnimationSettings";
import { TileAssets } from "../../core/assets/TileAssets";
import { BoardSyncedEvent } from "../../core/events/BoardSyncedEvent";
import { getWorldPosition } from "../../core/utils/position";
import { EventView } from "../../core/view/EventView";
import { BoardViewContext } from "../context/BoardViewContext";
import { BoardMap } from "./BoardMap";
import { TileView } from "./TileView";


const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends EventView<BoardViewContext> {
    @property(cc.Prefab)
    private tilePrefab: cc.Prefab = null!;

    @property(cc.Node)
    private backgroundLayer: cc.Node = null!;

    @property(cc.Node)
    private tileLayer: cc.Node = null!;

    @property(cc.Node)
    private fxLayer: cc.Node = null!;

    @property(TileAssets)
    private tileAssets: TileAssets = null!;

    private boardMap!: BoardMap;

    protected onInit(): void {
        this.boardMap = new BoardMap(this.context.boardWidth, this.context.boardHeight);
            (
                this.boardMap,
                this.context.animationSystem,
                this.tileAssets,
                this.context.boardWidth,
                this.context.boardHeight
            )
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
            view.node.setPosition(getWorldPosition(change.position, view.node, this.context.boardWidth, this.context.boardHeight));
            view.show();
        }
    }

    private async animate(event: BoardChangedEvent): Promise<void> {
        await Promise.all([
            this.animateDestroy(event.destroyed),
            this.animateDrop(event.dropped),
            //this.animateSpawn(event.spawned)
        ]);
    }

    private async animateDestroy(data: TilePosition[]): Promise<void> {
        const tasks = [];

        for (const position of data) {
            const view = this.boardMap.get(position);
            if (!view) continue;
            view.node.setParent(this.backgroundLayer);
            tasks.push(
                this.context.animationSystem.play(AnimationSettings.tileDestroy(view.node))
                    .then(() => view.node.setParent(this.tileLayer))
            );
        }
        await Promise.all(tasks);
    }

    private async animateDrop(data: TileMove[]): Promise<void> {
        const tasks: Promise<void>[] = [];

        for (const move of data) {
            const view = this.boardMap.get(move.from);
            if (!view) continue;
            view.node.setParent(this.fxLayer);
            const targetY = getWorldPosition(move.to, view.node, this.context.boardWidth, this.context.boardHeight).y;
            tasks.push(this.context.animationSystem.play(AnimationSettings.tileFall(view.node, targetY))
                .then(() => view.node.setParent(this.tileLayer)));
        }

        await Promise.all(tasks);
    }

    private async animateSpawn(data: TileSpawn[]): Promise<void> {
        const tasks: Promise<void>[] = [];

        for (const spawn of data) {
            const view = this.boardMap.get(spawn.at);
            if (!view) continue;
            view.node.setParent(this.fxLayer);
            view.node.setPosition(getWorldPosition({x: spawn.at.x, y: -1}, view.node, this.context.boardWidth, this.context.boardHeight));
            const targetY = getWorldPosition(spawn.at, view.node, this.context.boardWidth, this.context.boardHeight).y;
            tasks.push(this.context.animationSystem.play(AnimationSettings.tileFall(view.node, targetY))
                .then(() => view.node.setParent(this.tileLayer)));
        }

        await Promise.all(tasks);
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