import { Matrix } from "../../../../core/collections/Matrix";
import { assertNotNull } from "../../../../core/utils/assert";
import { BoardProcessedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { BoardModel } from "../../../domain/board/models/BoardModel";
import { TileDrop } from "../../../domain/board/models/TileDrop";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSystem } from "../../animations/AnimationSystem";
import { AnimationType } from "../../animations/AnimationType";
import { TileAssets } from "../../assets/TileAssets";
import { BoardViewContext } from "../context/BoardViewContext";
import { BoardSyncedEvent } from "../../events/BoardSyncedEvent";
import { EventView } from "../../core/view/EventView";
import { TileView } from "./TileView";


const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends EventView<BoardViewContext> {
    @property(cc.Prefab)
    private tilePrefab: cc.Prefab = null!;

    @property(cc.Node)
    private tileLayer: cc.Node = null!;

    @property(cc.Node)
    private fxLayer: cc.Node = null!;

    @property(TileAssets)
    private tileAssets: TileAssets = null!;

    private views!: Matrix<TileView>;

    public override validate(): void {
        assertNotNull(this.tilePrefab, this, "tilePrefab");
        assertNotNull(this.tileLayer, this, "tileLayer");
        assertNotNull(this.fxLayer, this, "fxLayer");
        assertNotNull(this.tileAssets, this, "tileAssets");
    }

    protected override onInit(): void {
        this.views = new Matrix<TileView>(
            this.context.boardModel.width,
            this.context.boardModel.height,
            (x: number, y: number): TileView => this.createTile({ x, y })
        );

        this.render();
    }

    protected override subscribe(): void {
        this.on(BoardProcessedEvent, this.onBoardProcessed);
    }

    private createTile(position: TilePosition): TileView {
        const node: cc.Node = cc.instantiate(this.tilePrefab);
        node.setParent(this.tileLayer);
        node.setPosition(position.x * node.width, -position.y * node.height);

        const view = node.getComponent(TileView);
        assertNotNull(view, this, "TileView");

        view.init({
            eventBus: this.eventBus,
            position: position
        });

        return view;
    }

    private render(): void {
        this.context.boardModel.forEach((_, position: TilePosition): void => {
            this.updateTile(position);
        });

        this.emit(new BoardSyncedEvent());
    }

    private onBoardProcessed = async (event: BoardProcessedEvent): Promise<void> => {
        await Promise.all([
            this.animateDestruction(event.destroyed),
            this.animateGravity(event.dropped),
            this.animateSpawn(event.spawned)
        ])

        this.render();
    }

    private async animateDestruction(destroyed: TilePosition[]): Promise<void> {
        const tasks: Promise<void>[] = [];

        for (const position of destroyed) {
            const view = this.views.get(position.x, position.y);
            view.node.setParent(this.fxLayer);
            const task = this.context.animationSystem
                .play(AnimationType.DESTRUCTION, view.getTarget())
                .then(() => view.node.setParent(this.tileLayer));
            tasks.push(task);
        }

        await Promise.all(tasks);
    }

    private async animateGravity(dropped: TileDrop[]): Promise<void> {
        // const tasks: Promise<void>[] = [];

        // for (const move of dropped) {
        //     const from = this.views.get(move.from.x, move.from.y);
        //     const to = this.views.get(move.to.x, move.to.y);
        // }

        // await Promise.all(tasks);
    }

    private async animateSpawn(spawned: TilePosition[]): Promise<void> {
        //
    }

    private updateTile(position: TilePosition): void {
        const type: TileType = this.context.boardModel.get(position);
        const view: TileView = this.views.get(position.x, position.y);

        if (type === TileType.NONE) {
            view.hide();
        } else {
            view.show();
            view.set(this.tileAssets.get(type));
        }
    }
}