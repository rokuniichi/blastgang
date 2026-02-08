import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { TileAssets } from "../../common/assets/TileAssets";
import { EventView } from "../../common/view/EventView";
import { PresentationViewContextFactory } from "../../common/view/PresentationView";
import { PresentationGraph } from "../../PresentationGraph";
import { BoardViewContext } from "../context/BoardViewContext";
import { GameLoaded } from "../events/GameLoaded";
import { InitialBatchGate } from "./InitialBatchGate";
import { TileVisualOrchestrator } from "./TileVisualOrchestrator";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends EventView<BoardViewContext> {
    @property(cc.Node)
    private backgroundLayer: cc.Node = null!;

    @property(cc.Node)
    private tileLayer: cc.Node = null!;

    @property(cc.Node)
    private fxLayer: cc.Node = null!;

    @property(TileAssets)
    private tiles: TileAssets = null!;

    @property(ShardAssets)
    private shards: ShardAssets = null!;

    @property(cc.Prefab)
    private flash: cc.Prefab = null!;

    private _startupGate!: InitialBatchGate;
    private _visualOrchestrator!: TileVisualOrchestrator;

    public contextFactory(): PresentationViewContextFactory<BoardViewContext> {
        return (presentation: PresentationGraph) => new BoardViewContext(presentation);
    }

    protected onInit(): void {
        this._visualOrchestrator = new TileVisualOrchestrator(
            this.context.eventBus,
            this.context.visualConfig,
            this.context.tweenSystem,
            this.context.boardCols,
            this.context.boardRows,
            this.backgroundLayer,
            this.tileLayer,
            this.fxLayer,
            this.tiles,
            this.shards,
            this.flash
        );

        this._startupGate = new InitialBatchGate((batch) => this._visualOrchestrator.init(batch));

        const width = this.context.boardCols * this.context.visualConfig.tileWidth;
        const height = this.context.boardRows * this.context.visualConfig.tileHeight;

        console.log(`[BOARD VIEW] ${this.context.visualConfig.boardWidthPadding}:${this.context.visualConfig.boardHeightPadding}`);

        //const oldHeight = this.backgroundLayer.height;

        this.backgroundLayer.setContentSize(width + this.context.visualConfig.boardWidthPadding * 2, height + this.context.visualConfig.boardHeightPadding * 2);
        this.tileLayer.setContentSize(width, height);
        this.fxLayer.setContentSize(width, height);
        /* const diff = ((height + this.context.visualConfig.boardHeightPadding * 2) - oldHeight) / 2;
        this.node.setPosition(this.node.position.x, this.node.position.y - diff); */

        console.log("[BOARD VIEW] SUBSCRIBED");
        this.on(BoardMutationsBatch, this.onBoardMutated);
        this.on(GameLoaded, this.onGameLoaded);
    }

    private onBoardMutated = (result: BoardMutationsBatch) => {
        console.log("[BOARD VIEW] DISPATCH RECIEVED");
        if (this._startupGate.started)
            this._visualOrchestrator.dispatch(result);
        else
            this._startupGate.register(result);
    };

    private onGameLoaded = (event: GameLoaded) => {
        console.log("[BOARD VIEW] LOADED RECIEVED");
        this._startupGate.proceed();
    };

    protected onDispose(): void {
        this._visualOrchestrator.dispose();

        this.scheduleOnce(() => {
            console.log("[DISPOSE] TILE LAYER AFTER", this.tileLayer.childrenCount);
        });
        this.scheduleOnce(() => {
            console.log("[DISPOSE] LAYER AFTER", this.fxLayer.childrenCount);
        });
    }
}