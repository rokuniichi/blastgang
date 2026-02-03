import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { EventView } from "../../common/view/EventView";
import { BoardViewContext } from "../context/BoardViewContext";
import { TileVisualOrchestrator } from "./TileVisualOrchestrator";

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

    private _visualOrchestrator!: TileVisualOrchestrator;

    protected onInit(): void {
        this._visualOrchestrator = new TileVisualOrchestrator(
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

        
        this._visualOrchestrator.dispatch(new BoardMutationsBatch(this.context.initialBoard));

        this.on(BoardMutationsBatch, this.onBoardChanged);
    }

    private onBoardChanged = (result: BoardMutationsBatch) => {
        this._visualOrchestrator.dispatch(result);
    };
}