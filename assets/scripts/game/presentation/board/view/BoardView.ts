import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { RocketAssets } from "../../common/assets/RocketAssets";
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

    @property(RocketAssets)
    private rockets: RocketAssets = null!

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
            this.rockets,
            this.flash
        );

        this._startupGate = new InitialBatchGate((batch) => this._visualOrchestrator.init(batch));

        const width = this.context.boardCols * this.context.visualConfig.tileWidth;
        const height = this.context.boardRows * this.context.visualConfig.tileHeight;

        this.backgroundLayer.setContentSize(width + this.context.visualConfig.boardWidthPadding * 2, height + this.context.visualConfig.boardHeightPadding * 2);
        this.tileLayer.setContentSize(width, height);
        this.fxLayer.setContentSize(width, height);

        this.on(BoardMutationsBatch, this.onBoardMutated);
        this.on(GameLoaded, this.onGameLoaded);
    }

    private onBoardMutated = (result: BoardMutationsBatch) => {
        if (this._startupGate.started)
            this._visualOrchestrator.dispatch(result);
        else
            this._startupGate.register(result);
    };

    private onGameLoaded = (event: GameLoaded) => {
        this._startupGate.proceed();
    };

    protected onDispose(): void {
        this._visualOrchestrator.dispose();
    }
}