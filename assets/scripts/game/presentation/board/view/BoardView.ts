import { Matrix } from "../../../../core/collections/Matrix";
import { assertNotNull, assertNumber } from "../../../../core/utils/assert";
import { BoardChangedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { TileChange } from "../../../domain/board/models/TileChange";
import { TilePosition } from "../../../domain/board/models/TilePosition";
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
    private tileLayer: cc.Node = null!;

    @property(cc.Node)
    private fxLayer: cc.Node = null!;

    @property(TileAssets)
    private tileAssets: TileAssets = null!;

    private views!: Matrix<TileView>;

    public validate(): void {
        super.validate();
        assertNotNull(this.tilePrefab, this, "tilePrefab");
        assertNotNull(this.tileLayer, this, "tileLayer");
        assertNotNull(this.fxLayer, this, "fxLayer");
        assertNotNull(this.tileAssets, this, "tileAssets");
    }

    protected preInit(): void {
        super.preInit();
        assertNotNull(this.context.animationSystem, this, "animationSystem");
        assertNumber(this.context.boardWidth, this, "boardWidth");
        assertNumber(this.context.boardHeight, this, "boardHeight");
    }

    protected onInit(): void {
        this.views = new Matrix<TileView>(
            this.context.boardWidth,
            this.context.boardHeight,
            (x: number, y: number): TileView => this.createTile({ x, y })
        );

        this.render(this.context.initialBoard);
    }

    protected postInit(): void {
        this.on(BoardChangedEvent, this.onBoardProcessed);
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

    private updateTile(change: TileChange): void {
        const view = this.views.get(change.position.x, change.position.y);

        if (change.typeAfter === TileType.NONE) {
            view.hide();
        } else {
            view.show();
            view.set(this.tileAssets.get(change.typeAfter));
        }
    }


    private onBoardProcessed = async (event: BoardChangedEvent): Promise<void> => {
        await Promise.all([
            this.animateDestruction(event.destroyed),
        ])

        this.render(event.changes);
    }


    private render(changes: TileChange[]): void {
        for (const change of changes) {
            this.updateTile(change);
        }

        this.emit(new BoardSyncedEvent());
    }

    private async animateDestruction(destroyed: TilePosition[]): Promise<void> {
        const tasks: Promise<void>[] = [];

        for (const position of destroyed) {
            const view = this.views.get(position.x, position.y);
            view.node.setParent(this.fxLayer);
            tasks.push(this.context.animationSystem.play(AnimationSettings.tileDestroy(view.getTarget())));
            view.node.setParent(this.tileLayer);
        }

        await Promise.all(tasks);
    }
}