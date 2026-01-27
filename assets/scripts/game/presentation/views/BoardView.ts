import { EventView } from "./EventView";
import { BoardViewContext } from "../context/BoardViewContext";
import { BoardModel } from "../../domain/models/BoardModel";
import { Matrix } from "../../../core/collections/Matrix";
import { TileView } from "./TileView";
import { TilePosition } from "../../domain/models/TilePosition";
import { TileType } from "../../domain/models/TileType";
import { assertNotNull } from "../../../core/utils/assert";
import { TilesDestroyedEvent } from "../../domain/events/TilesDestroyedEvent";
import { TileAssets } from "../assets/TileAssets";
import { AnimationSystem } from "../animation-system/AnimationSystem";
import { AnimationType } from "../animation-system/AnimationType";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends EventView<BoardViewContext> {
    @property(cc.Prefab)
    private tilePrefab: cc.Prefab = null!;

    @property(cc.Node)
    private tileRoot: cc.Node = null!;

    @property(TileAssets)
    private tileAssets: TileAssets = null!;

    private board!: BoardModel;
    private animationSystem!: AnimationSystem;

    private views!: Matrix<TileView>;

    public override validate(): void {
        assertNotNull(this.tilePrefab, this, "tilePrefab");
        assertNotNull(this.tileRoot, this, "tileRoot");
        assertNotNull(this.tileAssets, this, "tileAssets");
    }

    protected override onInit(): void {
        this.board = this.context.board;
        this.animationSystem = this.context.animationSystem;

        this.views = new Matrix<TileView>(
            this.board.width,
            this.board.height,
            (x: number, y: number): TileView => this.createTile({ x, y })
        );

        this.syncBoard();
    }

    protected override subscribe(): void {
        this.on(TilesDestroyedEvent, this.onTilesDestroyed);
    }

    private createTile(pos: TilePosition): TileView {
        const node: cc.Node = cc.instantiate(this.tilePrefab);
        node.setParent(this.tileRoot);
        node.setPosition(pos.x * node.width, -pos.y * node.height);

        const view: TileView | null = node.getComponent(TileView);
        assertNotNull(view, this, "TileView");

        view.init({
            eventBus: this.eventBus,
            position: pos
        });

        return view;
    }

    private syncBoard(): void {
        this.board.forEach((_type: TileType, pos: TilePosition): void => {
            this.updateTile(pos);
        });
    }

    private onTilesDestroyed = (event: TilesDestroyedEvent): void => {
        for (const position of event.tiles) {
            const view = this.views.get(position.x, position.y);
            if (view === null) continue;
            this.animationSystem.play(AnimationType.DESTRUCTION, view.getTarget());
        }
    };

    private updateTile(position: TilePosition): void {
        const type: TileType = this.board.get(position);
        const view: TileView = this.views.get(position.x, position.y);

        if (type === TileType.NONE) {
            view.hide();
        } else {
            view.show();
            view.set(this.tileAssets.get(type));
        }
    }
}