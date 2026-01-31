import { EventBus } from "../../../core/events/EventBus";
import { RuntimeBoardModel } from "../../application/board/runtime/RuntimeBoardModel";
import { TileCommit } from "../../domain/board/models/TileChange";
import { DomainContext } from "../../domain/context/DomainContext";

export class PresentationContext {
    public readonly eventBus: EventBus;
    public readonly boardRuntime: RuntimeBoardModel;
    public readonly movesLeft: number;
    public readonly targetScore: number;
    public readonly currentScore: number;
    public readonly boardWidth: number;
    public readonly boardHeight: number;
    public readonly initialBoard: TileCommit[];

    public constructor(domainContext: DomainContext, initialBoard: TileCommit[]) {
        this.eventBus = domainContext.eventBus;
        this.boardRuntime = domainContext.runtimeModel;
        this.movesLeft = domainContext.gameStateModel.movesLeft;
        this.targetScore = domainContext.gameStateModel.targetScore;
        this.currentScore = domainContext.gameStateModel.currentScore;
        this.boardWidth = domainContext.logicalModel.width;
        this.boardHeight = domainContext.logicalModel.height;
        this.initialBoard = initialBoard;
    }
}