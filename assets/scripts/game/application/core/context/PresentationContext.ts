import { EventBus } from "../../../../core/events/EventBus";
import { TileChange } from "../../../domain/board/models/TileChange";
import { DomainContext } from "./DomainContext";

export class PresentationContext {
    public readonly eventBus: EventBus;
    public readonly movesLeft: number;
    public readonly targetScore: number;
    public readonly currentScore: number;
    public readonly boardWidth: number;
    public readonly boardHeight: number;
    public readonly initialBoard: TileChange[];

    public constructor(domainContext: DomainContext) {
        this.eventBus = domainContext.eventBus;
        this.movesLeft = domainContext.gameStateModel.movesLeft;
        this.targetScore = domainContext.gameStateModel.targetScore;
        this.currentScore = domainContext.gameStateModel.currentScore;
        this.boardWidth = domainContext.boardModel.width;
        this.boardHeight = domainContext.boardModel.height;
        this.initialBoard = domainContext.initialBoard;
    }
}