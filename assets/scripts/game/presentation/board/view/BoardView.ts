import { BoardProcessResult } from "../../../domain/board/events/BoardProcessResult";
import { TileClickRejection, TileClickRejectionReason } from "../../../domain/board/events/TileClickRejection";
import { EventView } from "../../common/view/EventView";
import { BoardViewContext } from "../context/BoardViewContext";
import { BoardVisualOrchestrator } from "./BoardVisualOrchestrator";

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardView extends EventView<BoardViewContext> {

    @property(cc.Node)
    private backgroundLayer: cc.Node = null!

    @property(cc.Node)
    private tileLayer: cc.Node = null!;

    @property(cc.Node)
    private fxLayer: cc.Node = null!;

    @property(cc.Prefab)
    private tilePrefab: cc.Prefab = null!;

    private _visualOrchestrator!: BoardVisualOrchestrator;

    protected onInit(): void {
        this._visualOrchestrator = new BoardVisualOrchestrator(
            this.context.eventBus,
            this.context.animationSystem,
            this.context.runtimeModel,
            this.context.boardWidth,
            this.context.boardHeight,
            this.backgroundLayer,
            this.tileLayer,
            this.fxLayer,
            this.tilePrefab
        );

        this._visualOrchestrator.visualize(new BoardProcessResult(this.context.initialBoard, { destroyed: [], dropped: [], spawned: [] }));

        this.on(BoardProcessResult, this.onBoardChanged);
        this.on(TileClickRejection, this.onTileClickRejected)
    }

    private onBoardChanged = async (result: BoardProcessResult) => {
        this._visualOrchestrator.visualize(result);
    };

    private onTileClickRejected = async (event: TileClickRejection) => {
        if (event.reason == TileClickRejectionReason.NO_CLUSTER) {
            this._visualOrchestrator.animateShake(event.position);
        }
    }
}