import { Matrix } from "../../../core/collections/Matrix";
import { assertNotNull } from "../../../core/utils/assert";
import { GravityAppliedEvent } from "../../domain/events/GravityAppliedEvent";
import { TilesDestroyedEvent } from "../../domain/events/TilesDestroyedEvent";
import { BoardModel } from "../../domain/models/BoardModel";
import { TilePosition } from "../../domain/models/TilePosition";
import { TileType } from "../../domain/models/TileType";
import { AnimationSystem } from "../animation-system/AnimationSystem";
import { AnimationType } from "../animation-system/AnimationType";
import { TileAssets } from "../assets/TileAssets";
import { BoardViewContext } from "../context/BoardViewContext";
import { TilesFinishedDestroying } from "../events/TilesFinishedDestroying";
import { EventView } from "./EventView";
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

    private board!: BoardModel;
    private animationSystem!: AnimationSystem;

    private views!: Matrix<TileView>;

    public override validate(): void {
        assertNotNull(this.tilePrefab, this, "tilePrefab");
        assertNotNull(this.tileLayer, this, "tileLayer");
        assertNotNull(this.fxLayer, this, "fxLayer");
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
        this.on(GravityAppliedEvent, this.onGravityApplied);
    }

    private createTile(pos: TilePosition): TileView {
        const node: cc.Node = cc.instantiate(this.tilePrefab);
        node.setParent(this.tileLayer);
        node.setPosition(pos.x * node.width, -pos.y * node.height);

        const view = node.getComponent(TileView);
        assertNotNull(view, this, "TileView");

        view.init({
            eventBus: this.eventBus,
            position: pos
        });

        return view;
    }

    private syncBoard(): void {
        this.board.forEach((_, position: TilePosition): void => {
            this.updateTile(position);
        });
    }

    private onTilesDestroyed = (event: TilesDestroyedEvent): void => {
        for (const position of event.tiles) {
            const view = this.views.get(position.x, position.y);
            if (view === null) continue;
            view.node.setParent(this.fxLayer);
            this.animationSystem.play(AnimationType.DESTRUCTION, view.getTarget()).then(() => view.node.setParent(this.tileLayer)).then(() => this.emit(new TilesFinishedDestroying));   
        }
    };

    private onGravityApplied = (event: GravityAppliedEvent): void => {
        this.syncBoard();
    }

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