import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { TileAssets } from "../../common/assets/TileAssets";
import { EventView } from "../../common/view/EventView";
import { PresentationViewContextConstructor } from "../../common/view/PresentationView";
import { BoardViewContext } from "../context/BoardViewContext";
import { GameLoaded } from "../events/GameLoaded";
import { InitialBatchGate } from "./InitialBatchGate";
import { TileVisualOrchestrator } from "./TileVisualOrchestrator";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends EventView<BoardViewContext> {
    @property(cc.Node)
    private backgroundNode: cc.Node = null!;

    @property(cc.Node)
    private backgroundLayer: cc.Node = null!

    @property(cc.Node)
    private tileLayer: cc.Node = null!;

    @property(cc.Node)
    private fxLayer: cc.Node = null!;

    @property(TileAssets)
    private tiles: TileAssets = null!;

    @property(ShardAssets)
    private shardAssets: ShardAssets = null!;

    @property(cc.Prefab)
    private flash: cc.Prefab = null!;

    private _startupGate!: InitialBatchGate;
    private _visualOrchestrator!: TileVisualOrchestrator;

    public contextConstructor(): PresentationViewContextConstructor<BoardViewContext> {
        return BoardViewContext;
    }

    protected onInit(): void {
        this._visualOrchestrator = new TileVisualOrchestrator(
            this.context.eventBus,
            this.context.visualConfig,
            this.context.tweenHelper,
            this.context.boardCols,
            this.context.boardRows,
            this.backgroundLayer,
            this.tileLayer,
            this.fxLayer,
            this.tiles,
            this.shardAssets,
            this.flash
        );

        this._startupGate = new InitialBatchGate((batch) => this._visualOrchestrator.init(batch));

        this.backgroundNode.width = this.context.boardCols * this.context.visualConfig.nodeWidth;
        this.backgroundNode.height = this.context.boardRows * this.context.visualConfig.nodeHeight;

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
}