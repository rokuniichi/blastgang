import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { TileAssets } from "../../common/assets/TileAssets";
import { EventView } from "../../common/view/EventView";
import { BoardViewContext } from "../context/BoardViewContext";
import { LoadingScreenFaded } from "../events/LoadingScreenFaded";
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

    private _visualOrchestrator!: TileVisualOrchestrator;

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

        this.backgroundNode.width = this.context.boardCols * this.context.visualConfig.nodeWidth;
        this.backgroundNode.height = this.context.boardRows * this.context.visualConfig.nodeHeight;
        this.on(BoardMutationsBatch, this.onBoardChanged);
        this.on(LoadingScreenFaded, this.onLoadingScreenFaded)
    }

    private onBoardChanged = (result: BoardMutationsBatch) => {
        this._visualOrchestrator.dispatch(result);
    };

    private onLoadingScreenFaded = (event: LoadingScreenFaded) => {
        this._visualOrchestrator.init(this.context.initialBoard);
    }
}