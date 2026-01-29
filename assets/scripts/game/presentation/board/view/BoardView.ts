import { BoardChangedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { TileMove } from "../../../domain/board/models/TileMove";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileSpawn } from "../../../domain/board/models/TileSpawn";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSettings } from "../../animations/AnimationSettings";
import { TileAssets } from "../../assets/TileAssets";
import { EventView } from "../../core/view/EventView";
import { BoardSyncedEvent } from "../../events/BoardSyncedEvent";
import { BoardViewContext } from "../context/BoardViewContext";
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

    private tiles = new Map<number, TileView>();

    protected onInit(): void {
        this.initBoard();
        this.on(BoardChangedEvent, this.onBoardChanged);
    }

    private initBoard(): void {
        this.context.initialBoard.forEach((spawn) => {
            let view = this.get(spawn.at);
            if (!view) view = this.createTile(spawn.at);
            view.set(this.tileAssets.get(spawn.type));
            this.set(spawn.at, view);
        })
    }

    private onBoardChanged = async (event: BoardChangedEvent) => {
        await this.animate(event);
        this.syncBoard(event);
    };

    private syncBoard(event: BoardChangedEvent) {
        /* event.destroyed.forEach((position) => this.destroyTile(position)); */
        /* event.dropped.forEach((move) => this.dropTile(move.from, move.to)); */
        /* event.spawned.forEach((spawn) => this.spawnTile(spawn.at, spawn.type)); */
        event.changes.forEach((change) => {
            const view = this.get(change.position);
            if (!view) return;
            view.set(this.tileAssets.get(change.after));
        })
        this.emit(new BoardSyncedEvent());
        /* const board = this.context.boardModel;

        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                const pos = { x, y };
                const type = board.get(pos);

                const view = this.tiles.get(this.key(x, y));

                if (type === TileType.NONE) {
                    if (view) view.hide();
                } else {
                    if (!view) {
                        const v = this.createTile(pos);
                        v.set(this.tileAssets.get(type));
                        this.tiles.set(this.key(x, y), v);
                    } else {
                        view.show();
                        view.set(this.tileAssets.get(type));
                    }
                }
            }
        } */
    }

    private async animate(event: BoardChangedEvent) {
        await Promise.all([
            //this.animateDestroy(event.destroyed),
            //this.animateDrop(event.dropped),
            //this.animateSpawn(event.spawned)
        ]);
    }

    private async animateDestroy(data: TilePosition[]) {
        const tasks = [];

        for (const position of data) {
            const view = this.get(position);
            if (!view) continue;

            tasks.push(
                this.context.animationSystem
                    .play(AnimationSettings.tileDestroy(view.get()))
                    .then(() => {
                        view.node.destroy();
                        this.delete(position);
                    })
            );
        }

        await Promise.all(tasks);
    }

    private async animateDrop(data: TileMove[]) {
        const tasks = [];

        for (const move of data) {
            const view = this.get(move.from);
            if (!view) continue;

            this.delete(move.from);
            this.set(move.to, view);

            const startY = -move.from.y * view.node.height;
            const finalY = -move.to.y * view.node.height;
            const delta = finalY - startY;

            tasks.push(this.animateFall(view.node, startY, delta));
        }

        await Promise.all(tasks);
    }

    private async animateSpawn(data: TileSpawn[]) {
        const tasks = [];

        for (const spawn of data) {
            const view = this.createTile(spawn.at);
            this.set(spawn.at, view);
            const finalY = -spawn.at.y * view.node.height;
            const startY = finalY + view.node.height * 6;
            const delta = finalY - startY;

            tasks.push(this.animateFall(view.node, startY, delta));
        }

        await Promise.all(tasks);
    }

    private animateFall(node: cc.Node, startY: number, delta: number) {
        return this.context.animationSystem.play(AnimationSettings.tileFall(node, startY, delta));
    }

    private createTile(position: TilePosition): TileView {
        const node = cc.instantiate(this.tilePrefab);
        node.setParent(this.tileLayer);
        node.setPosition(position.x * node.width, -position.y * node.height);
        const view = node.getComponent(TileView)!;
        view.init({
            eventBus: this.eventBus,
            position: position
        });

        return view;
    }

    private destroyTile(position: TilePosition): void {
        this.get(position)?.hide();
    }

    private dropTile(from: TilePosition, to: TilePosition, type: TileType): void {
        this.destroyTile(from);
        this.spawnTile(to, type);
    }

    private spawnTile(at: TilePosition, type: TileType): void {
        const view = this.get(at);
        if (view === null) return;
        view.set(this.tileAssets.get(type));
        view.show();
    }

    private get(position: TilePosition): TileView | null {
        const result = this.tiles.get(TilePosition.key(position, this.context.boardWidth));
        return result ?? null;
    }

    private set(position: TilePosition, tile: TileView): void {
        this.tiles.set(TilePosition.key(position, this.context.boardWidth), tile)
    }

    private delete(position: TilePosition): void {
        this.tiles.delete(TilePosition.key(position, this.context.boardWidth));

    }
}