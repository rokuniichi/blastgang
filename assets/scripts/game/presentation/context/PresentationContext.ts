import { EventBus } from "../../../core/events/EventBus";
import { BoardRuntimeModel } from "../../application/board/runtime/BoardRuntimeModel";
import { VisualConfig } from "../../application/common/config/visual/VisualConfig";
import { TileSpawned } from "../../domain/board/events/mutations/TileSpawned";
import { DomainContext } from "../../domain/context/DomainContext";

export class PresentationContext {
    public readonly visualConfig: VisualConfig;
    public readonly eventBus: EventBus;
    public readonly boardRuntime: BoardRuntimeModel;
    public readonly movesLeft: number;
    public readonly targetScore: number;
    public readonly currentScore: number;
    public readonly boardCols: number;
    public readonly boardRows: number;
    public readonly initialBoard: TileSpawned[];

    public constructor(visualConfig: VisualConfig, domainContext: DomainContext, initialBoard: TileSpawned[]) {
        this.visualConfig = visualConfig;
        this.eventBus = domainContext.eventBus;
        this.boardRuntime = domainContext.runtimeModel;
        this.movesLeft = domainContext.gameStateModel.movesLeft;
        this.targetScore = domainContext.gameStateModel.targetScore;
        this.currentScore = domainContext.gameStateModel.currentScore;
        this.boardCols = domainContext.logicalModel.width;
        this.boardRows = domainContext.logicalModel.height;
        this.initialBoard = initialBoard;
    }
}